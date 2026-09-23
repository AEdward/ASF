import { factories } from "@strapi/strapi";

const MAX_LEN = 255;
const MAX_TEXT = 4000;
const VALID_SOURCES = ["client", "server"] as const;
type Source = (typeof VALID_SOURCES)[number];

export default factories.createCoreController("api::site-error.site-error", () => ({
  async create(ctx) {
    const body = (ctx.request.body as { data?: Record<string, unknown> })?.data || {};
    const source: Source = VALID_SOURCES.includes(body.source as Source)
      ? (body.source as Source)
      : "client";
    const message = String(body.message || "").slice(0, MAX_TEXT);
    if (!message) {
      return ctx.badRequest("message is required");
    }
    const path = String(body.path || "").slice(0, MAX_LEN);
    const stack = String(body.stack || "").slice(0, MAX_TEXT);

    const entry = await strapi.documents("api::site-error.site-error").create({
      data: { source, message, path, stack },
    });
    ctx.body = { data: entry };
  },
}));
