import { Eye, Globe, CheckCircle, WarningCircle } from "@strapi/icons";
import type { StrapiApp } from "@strapi/admin/strapi-admin";
import {
  VisitsWidget,
  TopPagesWidget,
  SiteHealthWidget,
  RecentErrorsWidget,
} from "./widgets";

export default {
  config: {
    locales: [],
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
