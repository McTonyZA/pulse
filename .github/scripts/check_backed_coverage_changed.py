#!/usr/bin/env python3
import argparse, os, sys, xml.etree.ElementTree as ET
from typing import Dict, Tuple, List

def parse_args():
    ap = argparse.ArgumentParser()
    ap.add_argument("--report", required=True, help="Path to jacoco.xml")
    ap.add_argument("--changed-files", required=True, help="Path to a file listing changed .java paths")
    ap.add_argument("--src-root", required=True, help="Path prefix to strip (e.g., backend/server/src/main/java)")
    ap.add_argument("--min-line", type=float, default=80.0, help="Minimum LINE coverage %% for changed files")
    return ap.parse_args()

def sum_line_counter(elem) -> Tuple[int,int]:
    for c in elem.findall("counter"):
        if c.get("type") == "LINE":
            m = int(c.get("missed", "0")); v = int(c.get("covered", "0"))
            return m, v
    return 0, 0

def sum_per_line(elem) -> Tuple[int,int]:
    m = v = 0
    for ln in elem.findall("line"):
        m += int(ln.get("mi", "0"))
        v += int(ln.get("ci", "0"))
    return m, v

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

def cov_for_source(pkg: str, srcfile: str, pkg_to_sf, pkg_to_classes) -> Tuple[int,int]:
    sf = pkg_to_sf.get(pkg, {}).get(srcfile)
    if sf is not None:
        m, v = sum_line_counter(sf)
        if m == 0 and v == 0:
            m, v = sum_per_line(sf)
        if m or v:
            return m, v
    for p, sfs in pkg_to_sf.items():
        sf2 = sfs.get(srcfile)
        if sf2 is not None:
            m, v = sum_line_counter(sf2)
            if m == 0 and v == 0:
                m, v = sum_per_line(sf2)
            if m or v:
                return m, v
    m = v = 0
    for c in pkg_to_classes.get(pkg, []):
        if c.get("sourcefilename") == srcfile:
            cm, cv = sum_line_counter(c)
            m += cm; v += cv
    if m or v:
        return m, v
    return 0, 0

def main():
    args = parse_args()
    src_root = args.src_root.rstrip("/") + "/"
    root = load_report(args.report)
    pkg_to_sf, pkg_to_classes = build_indexes(root)

    with open(args.changed_files, "r") as f:
        changed = [ln.strip() for ln in f if ln.strip()]

    total_missed = 0
    total_covered = 0
    analyzed = 0

    for path in changed:
        if not path.endswith(".java"):
            continue
        if not path.startswith(src_root):
            continue
        rel = path[len(src_root):]
        parts = rel.split("/")
        if len(parts) < 1:
            continue
        srcfile = parts[-1]
        pkg = "/".join(parts[:-1])
        m, v = cov_for_source(pkg, srcfile, pkg_to_sf, pkg_to_classes)
        print(f"COVERAGE for {rel} -> missed={m} covered={v}", file=sys.stderr)
        if m or v:
            analyzed += 1
            total_missed += m
            total_covered += v

    if analyzed == 0 or (total_missed + total_covered) == 0:
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a") as f:
            f.write("ℹ️ No coverage data available for changed files\n\n")
        sys.exit(4)

    total = total_missed + total_covered
    pct = (total_covered / total) * 100.0
    with open(os.environ["GITHUB_STEP_SUMMARY"], "a") as f:
        f.write(f"**Changed Files Coverage:** {pct:.2f}%\n")
        f.write(f"- Lines Covered: {total_covered}\n")
        f.write(f"- Lines Missed: {total_missed}\n")
        f.write(f"- Total Lines: {total}\n\n")
        if pct < args.min_line:
            f.write(f"❌ **Build Failed: Changed files coverage ({pct:.2f}%) is below minimum threshold of {args.min_line:.2f}%**\n\n")
        else:
            f.write("✅ Changed files coverage meets the requirement\n\n")

    if pct < args.min_line:
        sys.exit(1)
    sys.exit(0)

if __name__ == "__main__":
    main()
