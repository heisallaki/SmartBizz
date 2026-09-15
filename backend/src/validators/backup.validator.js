const { z } = require("zod");
const { paginationQuerySchema } = require("./common.validator");

const restoreBackupSchema = z.object({
  tables: z.record(z.string(), z.array(z.any())).optional(),
});

module.exports = { listBackupsQuerySchema: paginationQuerySchema, restoreBackupSchema };