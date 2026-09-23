import fs from "fs";
import os from "os";
import type { Core } from "@strapi/strapi";

const RETENTION_DAYS = 90;

async function pruneOldRecords(strapi: Core.Strapi) {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  for (const uid of [
    "api::page-view.page-view",
    "api::site-error.site-error",
    "api::health-check.health-check",
  ] as const) {
    const old = await strapi.documents(uid).findMany({
      filters: { createdAt: { $lt: cutoff.toISOString() } },
      limit: 500,
    });
    for (const entry of old) {
      await strapi.documents(uid).delete({ documentId: entry.documentId });
    }
  }
}

export default {
  healthCheck: {
    task: async ({ strapi }: { strapi: Core.Strapi }) => {
      let dbOk = true;
      try {
        await strapi.db.connection.raw("SELECT 1");
      } catch {
        dbOk = false;
      }

      let freeDiskMb: number | undefined;
      let totalDiskMb: number | undefined;
      try {
        const stats = fs.statfsSync(strapi.dirs.app.root);
        freeDiskMb = Math.round((stats.bavail * stats.bsize) / (1024 * 1024));
        totalDiskMb = Math.round((stats.blocks * stats.bsize) / (1024 * 1024));
      } catch {
        // statfs unsupported on this platform — leave undefined
      }

      const freeMemMb = Math.round(os.freemem() / (1024 * 1024));
      const totalMemMb = Math.round(os.totalmem() / (1024 * 1024));

      await strapi.documents("api::health-check.health-check").create({
        data: {
          status: dbOk ? "ok" : "error",
          dbOk,
          freeDiskMb,
          totalDiskMb,
          freeMemMb,
          totalMemMb,
        },
      });

      // Piggyback the retention cleanup on the same tick — no separate
      // schedule to manage, and it only runs every 15 minutes anyway.
      await pruneOldRecords(strapi);
    },
    options: {
      rule: "*/15 * * * *",
    },
  },
};
