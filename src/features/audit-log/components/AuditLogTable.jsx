import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import formatDate from "../../../utils/formatDate";

function humanizeMetadataKey(key) {
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean);

  return words
    .map((word) => (word.toLowerCase() === "id" ? "ID" : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}

function formatMetadataValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function getMetadataEntries(metadata) {
  if (!metadata || typeof metadata !== "object") return [];
  return Object.entries(metadata).map(([key, value]) => ({
    key,
    label: humanizeMetadataKey(key),
    value: formatMetadataValue(value),
  }));
}

export default function AuditLogTable({ rows }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Date</strong>
            </TableCell>
            <TableCell>
              <strong>User</strong>
            </TableCell>
            <TableCell>
              <strong>Action</strong>
            </TableCell>
            <TableCell>
              <strong>Entity</strong>
            </TableCell>
            <TableCell>
              <strong>Details</strong>
            </TableCell>
            <TableCell>
              <strong>IP Address</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                No audit events match these filters.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const entries = getMetadataEntries(row.metadata);

              return (
                <TableRow key={row.id} hover>
                  <TableCell>
                    {formatDate(row.createdAt, { dateStyle: "medium", timeStyle: "short" })}
                  </TableCell>

                  <TableCell>{row.userName}</TableCell>

                  <TableCell>{row.actionLabel}</TableCell>

                  <TableCell>
                    {row.entityId ? `${row.entityTypeLabel} #${row.entityId}` : row.entityTypeLabel}
                  </TableCell>

                  <TableCell>
                    {entries.length > 0 ? (
                      <Tooltip
                        title={
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, py: 0.5 }}>
                            {entries.map((entry) => (
                              <Typography key={entry.key} variant="caption" component="span">
                                {entry.label}: {entry.value}
                              </Typography>
                            ))}
                          </Box>
                        }
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            maxWidth: 260,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {entries.map((entry) => `${entry.label}: ${entry.value}`).join(", ")}
                        </Typography>
                      </Tooltip>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  <TableCell>{row.ipAddress || "—"}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}