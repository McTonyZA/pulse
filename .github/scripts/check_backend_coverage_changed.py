#!/usr/bin/env python3
import argparse, os, sys, xml.etree.ElementTree as ET
from typing import Dict, Tuple, List

METRICS = ("LINE", "BRANCH", "INSTRUCTION", "METHOD", "CLASS")

def parse_args():
    ap = argparse.ArgumentParser(description="Changed-files-only JaCoCo coverage checker with full metrics table")
    ap.add_argument("--report", required=True, help="Path to jacoco.xml")
    ap.add_argument("--changed-files", required=True, help="Path to a file listing changed .java paths")
    ap.add_argument("--src-root", required=True, help="Path prefix to strip (e.g., backend/server/src/main/java)")
    ap.add_argument("--min-line", type=float, default=0.0, help="Minimum LINE coverage %% for changed files (0=disable)")
    ap.add_argument("--min-branch", type=float, default=0.0, help="Minimum BRANCH coverage %% for changed files (0=disable)")
    ap.add_argument("--min-instruction", type=float, default=0.0, help="Minimum INSTRUCTION coverage %% for changed files (0=disable)")
    ap.add_argument("--min-method", type=float, default=0.0, help="Minimum METHOD coverage %% for changed files (0=disable)")
    ap.add_argument("--min-class", type=float, default=0.0, help="Minimum CLASS coverage %% for changed files (0=disable)")
    ap.add_argument("--fail-if-no-changed", action="store_true", help="Fail if no changed coverage data is found")
    return ap.parse_args()

def sum_counters(elem) -> Dict[str, Tuple[int,int]]:
    out = {}
    for c in elem.findall("counter"):
        t = c.get("type")
        if t in METRICS:
            out[t] = (int(c.get("missed","0")), int(c.get("covered","0")))
    return out

def sum_per_line(elem) -> Tuple[int,int,int,int]:
    # For sourcefile: sum LINE (mi/ci) and BRANCH (mb/cb)
    mi=ci=mb=cb=0
    for ln in elem.findall("line"):
        mi += int(ln.get("mi","0"))
        ci += int(ln.get("ci","0"))
        mb += int(ln.get("mb","0"))
        cb += int(ln.get("cb","0"))
    return mi,ci,mb,cb

def load_report(path: str):
    try:
        tree = ET.parse(path)
        return tree.getroot()
    except Exception as e:
        print(f"[ERROR] Failed to parse '{path}': {e}", file=sys.stderr)
        sys.exit(3)

def build_indexes(root):
    pkg_to_sf: Dict[str, Dict[str, object]] = {}
    pkg_to_classes: Dict[str, List[object]] = {}
    for p in root.findall(".//package"):
        pname = p.get("name") or ""
        pkg_to_sf[pname] = {}
        pkg_to_classes[pname] = []
        for sf in p.findall("sourcefile"):
            sname = sf.get("name")
            if sname:
                pkg_to_sf[pname][sname] = sf
        for c in p.findall("class"):
            pkg_to_classes[pname].append(c)
    return pkg_to_sf, pkg_to_classes

def add_tuples(a: Tuple[int,int], b: Tuple[int,int]) -> Tuple[int,int]:
    return (a[0]+b[0], a[1]+b[1])

def cov_for_source(pkg: str, srcfile: str, pkg_to_sf, pkg_to_classes) -> Dict[str, Tuple[int,int]]:
    """
    Compute (missed,covered) per metric for a single source file.
    - For LINE & BRANCH: prefer sourcefile counters; fallback to per-line sums.
    - For INSTRUCTION/METHOD/CLASS: sum class counters with matching sourcefilename.
    - Fallback across packages if needed.
    """
    totals = {m:(0,0) for m in METRICS}

    def apply_from_sourcefile(sf):
        c = sum_counters(sf)
        if "LINE" in c: totals["LINE"] = add_tuples(totals["LINE"], c["LINE"])
        if "BRANCH" in c: totals["BRANCH"] = add_tuples(totals["BRANCH"], c["BRANCH"])
        mi,ci,mb,cb = sum_per_line(sf)
        if mi or ci: totals["LINE"] = add_tuples(totals["LINE"], (mi,ci))
        if mb or cb: totals["BRANCH"] = add_tuples(totals["BRANCH"], (mb,cb))

    def apply_from_classes(package_name):
        for cls in pkg_to_classes.get(package_name, []):
            if cls.get("sourcefilename") == srcfile:
                c = sum_counters(cls)
                for m in ("INSTRUCTION","METHOD","CLASS","LINE","BRANCH"):
                    if m in c:
                        totals[m] = add_tuples(totals[m], c[m])

    # 1) Exact package + sourcefile
    sf = pkg_to_sf.get(pkg, {}).get(srcfile)
    if sf is not None:
        apply_from_sourcefile(sf)
        apply_from_classes(pkg)

    # 2) Any package that has this sourcefile
    if all(totals[m] == (0,0) for m in METRICS):
        for p, sfs in pkg_to_sf.items():
            sf2 = sfs.get(srcfile)
            if sf2 is not None:
                apply_from_sourcefile(sf2)
                apply_from_classes(p)

    return totals

def pct(covered:int, missed:int) -> float:
    total = covered + missed
    return (covered * 100.0 / total) if total else 0.0

def main():
    args = parse_args()
    src_root = args.src_root.rstrip("/") + "/"
    root = load_report(args.report)
    pkg_to_sf, pkg_to_classes = build_indexes(root)

    with open(args.changed_files, "r") as f:
        changed = [ln.strip() for ln in f if ln.strip()]

    totals = {m:(0,0) for m in METRICS}
    analyzed = 0

    for path in changed:
        if not path.endswith(".java"):
            continue
        if not path.startswith(src_root):
            continue
        rel = path[len(src_root):]
        parts = rel.split("/")
        if not parts:
            continue
        srcfile = parts[-1]
        pkg = "/".join(parts[:-1])

        per_file = cov_for_source(pkg, srcfile, pkg_to_sf, pkg_to_classes)
        if any(per_file[m] != (0,0) for m in METRICS):
            analyzed += 1
            for m in METRICS:
                totals[m] = add_tuples(totals[m], per_file[m])

        # debug log
        lm, lc = per_file["LINE"]
        bm, bc = per_file["BRANCH"]
        im, ic = per_file["INSTRUCTION"]
        mm, mc = per_file["METHOD"]
        cm, cc = per_file["CLASS"]
        print(f"COVERAGE for {rel} -> LINE {lc}/{lm}, BR {bc}/{bm}, INS {ic}/{im}, METH {mc}/{mm}, CLASS {cc}/{cm}", file=sys.stderr)

    # prepare summary
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    lines = []
    lines.append("### 📊 Changed Files Coverage")
    lines.append("")
    lines.append("| Metric | % | Covered | Missed | Total | Min % |")
    lines.append("|---|---:|---:|---:|---:|---:|")

    # thresholds map
    thresholds = {
        "LINE": args.min_line,
        "BRANCH": args.min_branch,
        "INSTRUCTION": args.min_instruction,
        "METHOD": args.min_method,
        "CLASS": args.min_class,
    }

    failures = []
    has_data = False
    for m in METRICS:
        miss, cov = totals[m]
        total = miss + cov
        percent = pct(cov, miss) if total else 0.0
        if total > 0:
            has_data = True
        lines.append(f"| {m} | {percent:.2f}% | {cov} | {miss} | {total} | {thresholds[m]:.2f}% |")
        if thresholds[m] > 0 and total > 0 and (percent + 1e-9) < thresholds[m]:
            failures.append(f"{m} {percent:.2f}% < {thresholds[m]:.2f}%")

    if not has_data:
        note = "ℹ️ No coverage data available for changed files"
        if path:
            with open(path, "a") as f:
                f.write(note + "\n\n")
        print(note)
        if args.fail_if_no_changed:
            sys.exit(1)
        sys.exit(4)

    lines.append("")
    if failures:
        lines.append("❌ **Build Failed: Changed-files coverage below thresholds**")
        for msg in failures:
            lines.append(f"- {msg}")
    else:
        lines.append("✅ Changed-files coverage meets configured thresholds")

    if path:
        with open(path, "a") as f:
            f.write("\n".join(lines) + "\n")
    print("\n".join(lines))

    if failures:
        sys.exit(1)
    sys.exit(0)

if __name__ == "__main__":
    main()
