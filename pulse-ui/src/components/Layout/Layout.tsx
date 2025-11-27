import { AppShell } from "@mantine/core";
import { LayoutProps } from "./Layout.interface";
import { COOKIES_KEY, LAYOUT_PAGE_CONSTANTS, ROUTES } from "../../constants";
import { useDisclosure } from "@mantine/hooks";
import { Navbar } from "../Navbar";
import { Main } from "../Main";
import { useLocation, useNavigate } from "react-router-dom";
import { Login } from "../../screens/Login";
import { useEffect, useRef, useState } from "react";
import { LoaderWithMessage } from "../LoaderWithMessage";
import { getCookies } from "../../helpers/cookies";

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);
  const { pathname } = useLocation();
  const [checkingCredentials, setCheckingCredentials] = useState(true);
  const displayMessage = useRef<string>(
    LAYOUT_PAGE_CONSTANTS.CHECKING_CREDENTIALS,
  );

  useEffect(() => {
    const token = getCookies(COOKIES_KEY.ACCESS_TOKEN);
    if (!token || token === "undefined") {
      setCheckingCredentials(false);
      navigate(ROUTES.LOGIN.basePath);
    } else {
      setCheckingCredentials(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checkingCredentials) {
    return <LoaderWithMessage loadingMessage={displayMessage.current} />;
  }

  if (pathname === ROUTES.LOGIN.path) {
    return <Login />;
  }

  return (
    <AppShell
      navbar={{
        width: opened ? 255 : 95,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <Navbar toggle={toggle} opened={opened} />
      <Main>{children}</Main>
    </AppShell>
  );
}
