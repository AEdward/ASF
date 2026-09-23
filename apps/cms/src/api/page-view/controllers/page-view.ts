import { factories } from "@strapi/strapi";

const MAX_LEN = 255;

export default factories.createCoreController("api::page-view.page-view", () => ({
  async create(ctx) {
    const body = (ctx.request.body as { data?: Record<string, unknown> })?.data || {};
    const path = String(body.path || "").slice(0, MAX_LEN);
    if (!path) {
      return ctx.badRequest("path is required");
    }
    const locale = String(body.locale || "").slice(0, 10);
    const referrer = String(body.referrer || "").slice(0, MAX_LEN);

    const entry = await strapi.documents("api::page-view.page-view").create({
      data: { path, locale, referrer },
    });
    ctx.body = { data: entry };
  },
}));
