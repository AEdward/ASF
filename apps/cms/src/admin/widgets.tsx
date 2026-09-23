import * as React from "react";
import { Widget, useFetchClient } from "@strapi/admin/strapi-admin";
import { Box, Flex, Table, Tbody, Tr, Td, Typography, Badge } from "@strapi/design-system";

interface Summary {
  today: number;
  last7DaysTotal: number;
  last7Days: { date: string; count: number }[];
  topPages: { path: string; count: number }[];
}

interface HealthCheck {
  status: "ok" | "error";
  dbOk: boolean;
  freeDiskMb?: number;
  totalDiskMb?: number;
  freeMemMb?: number;
  totalMemMb?: number;
  createdAt: string;
}

interface SiteError {
  documentId: string;
  source: "client" | "server";
  message: string;
  path?: string;
  createdAt: string;
}

interface HealthResponse {
  latest: HealthCheck | null;
  uptimePercent24h: number | null;
  checksInLast24h: number;
  recentErrors: SiteError[];
}

function useAnalyticsSummary() {
  const { get } = useFetchClient();
  const [data, setData] = React.useState<Summary | null>(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    get("/analytics-dashboard/summary")
      .then((res) => setData(res.data as Summary))
      .catch(() => setError(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, error };
}

function useHealth() {
  const { get } = useFetchClient();
  const [data, setData] = React.useState<HealthResponse | null>(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    get("/analytics-dashboard/health")
      .then((res) => setData(res.data as HealthResponse))
      .catch(() => setError(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, error };
}

function formatDay(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" });
}

export function VisitsWidget() {
  const { data, error } = useAnalyticsSummary();

  if (error) return <Widget.Error />;
  if (!data) return <Widget.Loading />;
  if (data.last7DaysTotal === 0) return <Widget.NoData>No visits recorded yet</Widget.NoData>;

  const max = Math.max(...data.last7Days.map((d) => d.count), 1);

  return (
    <Box>
      <Flex justifyContent="space-between" marginBottom={3}>
        <Typography variant="omega" textColor="neutral600">
          Today: <Typography fontWeight="bold">{data.today}</Typography>
        </Typography>
        <Typography variant="omega" textColor="neutral600">
          Last 7 days: <Typography fontWeight="bold">{data.last7DaysTotal}</Typography>
        </Typography>
      </Flex>
      <Flex alignItems="flex-end" gap={2} height="6rem">
        {data.last7Days.map((day) => (
          <Flex key={day.date} direction="column" alignItems="center" gap={1} flex={1}>
            <Box
              background="primary500"
              width="100%"
              height={`${Math.max((day.count / max) * 100, 4)}%`}
              hasRadius
            />
            <Typography variant="pi" textColor="neutral500">
              {formatDay(day.date)}
            </Typography>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}

export function TopPagesWidget() {
  const { data, error } = useAnalyticsSummary();

  if (error) return <Widget.Error />;
  if (!data) return <Widget.Loading />;
  if (data.topPages.length === 0) return <Widget.NoData>No visits recorded yet</Widget.NoData>;

  return (
    <Table colCount={2} rowCount={data.topPages.length}>
      <Tbody>
        {data.topPages.map((page) => (
          <Tr key={page.path}>
            <Td>
              <Typography variant="omega" textColor="neutral800">
                {page.path}
              </Typography>
            </Td>
            <Td>
              <Typography variant="omega" textColor="neutral600">
                {page.count} views
              </Typography>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export function SiteHealthWidget() {
  const { data, error } = useHealth();

  if (error) return <Widget.Error />;
  if (!data) return <Widget.Loading />;
  if (!data.latest) return <Widget.NoData>No health checks recorded yet</Widget.NoData>;

  const { latest, uptimePercent24h } = data;
  const diskUsedPercent =
    latest.freeDiskMb != null && latest.totalDiskMb
      ? Math.round(((latest.totalDiskMb - latest.freeDiskMb) / latest.totalDiskMb) * 100)
      : null;
  const memUsedPercent =
    latest.freeMemMb != null && latest.totalMemMb
      ? Math.round(((latest.totalMemMb - latest.freeMemMb) / latest.totalMemMb) * 100)
      : null;

  return (
    <Box>
      <Flex gap={2} marginBottom={3} alignItems="center">
        <Badge active={latest.status === "ok"} backgroundColor={latest.status === "ok" ? "success500" : "danger500"}>
          {latest.status === "ok" ? "Healthy" : "Error"}
        </Badge>
        <Typography variant="omega" textColor="neutral600">
          Uptime (24h): {uptimePercent24h != null ? `${uptimePercent24h}%` : "—"}
        </Typography>
      </Flex>
      <Flex direction="column" gap={1}>
        <Typography variant="pi" textColor="neutral600">
          Database: {latest.dbOk ? "connected" : "unreachable"}
        </Typography>
        {diskUsedPercent != null && (
          <Typography variant="pi" textColor="neutral600">
            Disk used: {diskUsedPercent}% ({latest.freeDiskMb} MB free)
          </Typography>
        )}
        {memUsedPercent != null && (
          <Typography variant="pi" textColor="neutral600">
            Memory used: {memUsedPercent}% ({latest.freeMemMb} MB free)
          </Typography>
        )}
      </Flex>
    </Box>
  );
}

export function RecentErrorsWidget() {
  const { data, error } = useHealth();

  if (error) return <Widget.Error />;
  if (!data) return <Widget.Loading />;
  if (data.recentErrors.length === 0) return <Widget.NoData>No errors reported</Widget.NoData>;

  return (
    <Table colCount={3} rowCount={data.recentErrors.length}>
      <Tbody>
        {data.recentErrors.map((err) => (
          <Tr key={err.documentId}>
            <Td>
              <Badge>{err.source}</Badge>
            </Td>
            <Td>
              <Typography variant="omega" textColor="neutral800" ellipsis>
                {err.message.slice(0, 60)}
              </Typography>
            </Td>
            <Td>
              <Typography variant="pi" textColor="neutral500">
                {new Date(err.createdAt).toLocaleString()}
              </Typography>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
