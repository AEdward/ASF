import type { Core } from "@strapi/strapi";

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

async function getSummary(strapi: Core.Strapi) {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const views = await strapi.documents("api::page-view.page-view").findMany({
    filters: { createdAt: { $gte: since.toISOString() } },
    limit: 20000,
  });

  const byDay = new Map<string, number>();
  const byPath = new Map<string, number>();
  const todayKey = dateKey(new Date());
  let todayCount = 0;

  for (const view of views) {
    const created = new Date(view.createdAt as unknown as string);
    const key = dateKey(created);
    byDay.set(key, (byDay.get(key) || 0) + 1);
    byPath.set(view.path, (byPath.get(view.path) || 0) + 1);
    if (key === todayKey) todayCount += 1;
  }

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = dateKey(d);
    return { date: key, count: byDay.get(key) || 0 };
  });

  const topPages = Array.from(byPath.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, count]) => ({ path, count }));

  return {
    today: todayCount,
    last7DaysTotal: views.length,
    last7Days,
    topPages,
  };
}

async function getHealth(strapi: Core.Strapi) {
  const recent = await strapi.documents("api::health-check.health-check").findMany({
    sort: { createdAt: "desc" },
    limit: 96, // last 24h at 15-min intervals
  });

  const latest = recent[0] || null;
  const okCount = recent.filter((r) => r.status === "ok").length;
  const uptimePercent24h = recent.length > 0 ? Math.round((okCount / recent.length) * 1000) / 10 : null;

  const recentErrors = await strapi.documents("api::site-error.site-error").findMany({
    sort: { createdAt: "desc" },
    limit: 5,
  });

  return { latest, uptimePercent24h, checksInLast24h: recent.length, recentErrors };
}

const info = { pluginName: "asf-analytics", type: "admin" as const };

export function registerAnalyticsDashboardRoutes(strapi: Core.Strapi) {
  strapi.server.routes({
    type: "admin",
    routes: [
      {
        method: "GET",
        info,
        path: "/analytics-dashboard/summary",
        handler: async (ctx: { body: unknown }) => {
          ctx.body = await getSummary(strapi);
        },
        config: { policies: ["admin::isAuthenticatedAdmin"] },
      },
      {
        method: "GET",
        info,
        path: "/analytics-dashboard/health",
        handler: async (ctx: { body: unknown }) => {
          ctx.body = await getHealth(strapi);
        },
        config: { policies: ["admin::isAuthenticatedAdmin"] },
      },
    ],
  });
}
