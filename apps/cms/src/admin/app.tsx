import { Eye, Globe, CheckCircle, WarningCircle } from "@strapi/icons";
import type { StrapiApp } from "@strapi/admin/strapi-admin";
import AsfLogo from "./extensions/asf-logo.png";
import {
  VisitsWidget,
  TopPagesWidget,
  SiteHealthWidget,
  RecentErrorsWidget,
} from "./widgets";

// ASF's brand green, in place of Strapi's default purple, across both the
// light and dark admin themes. Only the tokens driving links, active nav
// state, icons and primary buttons are overridden — everything else
// (neutral greys, danger/success/warning) keeps Strapi's defaults.
const asfGreenLight = {
  primary100: "#EAFBEA",
  primary200: "#C6F6C6",
  primary500: "#2F9E44",
  primary600: "#237A34",
  primary700: "#1A5A26",
  buttonPrimary500: "#268A3B",
  buttonPrimary600: "#1D6B2D",
};

const asfGreenDark = {
  primary100: "#123018",
  primary200: "#1B4A24",
  primary500: "#4CC26B",
  primary600: "#6BD886",
  primary700: "#8FE8A6",
  buttonPrimary500: "#3AA858",
  buttonPrimary600: "#4CC26B",
};

export default {
  config: {
    locales: [],
    auth: {
      logo: AsfLogo,
    },
    menu: {
      logo: AsfLogo,
    },
    theme: {
      light: { colors: asfGreenLight },
      dark: { colors: asfGreenDark },
    },
  },
  register(app: StrapiApp) {
    app.widgets.register([
      {
        icon: Eye,
        title: { id: "asf.widget.visits.title", defaultMessage: "Visits (7 days)" },
        component: async () => VisitsWidget,
        id: "asf-visits",
      },
      {
        icon: Globe,
        title: { id: "asf.widget.top-pages.title", defaultMessage: "Top Pages" },
        component: async () => TopPagesWidget,
        id: "asf-top-pages",
      },
      {
        icon: CheckCircle,
        title: { id: "asf.widget.health.title", defaultMessage: "Site Health" },
        component: async () => SiteHealthWidget,
        id: "asf-site-health",
      },
      {
        icon: WarningCircle,
        title: { id: "asf.widget.errors.title", defaultMessage: "Recent Errors" },
        component: async () => RecentErrorsWidget,
        id: "asf-recent-errors",
      },
    ]);
  },
  bootstrap() {},
};
