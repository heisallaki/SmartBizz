const { Router } = require("express");
const { postBackup, getBackups, postRestoreBackup } = require("../controllers/backup.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { listBackupsQuerySchema, restoreBackupSchema } = require("../validators/backup.validator");

const router = Router();

router.use(requireAuth);
router.use(requireRole("Admin"));

router.get("/", validate(listBackupsQuerySchema, "query"), getBackups);
router.post("/", postBackup);
router.post("/restore", validate(restoreBackupSchema), postRestoreBackup);

module.exports = router;