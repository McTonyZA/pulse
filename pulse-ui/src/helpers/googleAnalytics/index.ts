import ReactGA from "react-ga4";
export const initGA = () => {
  const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID ?? "";
  !!GA_MEASUREMENT_ID && ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const logPageView = (path: string) => {
  !!process.env.REACT_APP_GA_MEASUREMENT_ID &&
    ReactGA.send({ hitType: "pageview", page: path });
};

export const logEvent = (
  action: string,
  label?: string,
  category: string = "User",
) => {
  !!process.env.REACT_APP_GA_MEASUREMENT_ID &&
    ReactGA.event({
      category,
      action,
      label,
    });
};
