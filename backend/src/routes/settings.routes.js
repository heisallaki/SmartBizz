const { Router } = require("express");
const {
  getBusinessSettings,
  patchBusinessSettings,
  postBusinessLogo,
} = require("../controllers/businessSetting.controller");
const {
  getNotificationPreferences,
  patchNotificationPreferences,
} = require("../controllers/notificationPreference.controller");
const { requireAuth } = require("../middleware/auth");
const { requirePermission } = require("../middleware/permission");
const { handleLogoUpload } = require("../middleware/upload");
const validate = require("../middleware/validate");
const { updateBusinessSettingsSchema } = require("../validators/businessSetting.validator");
const {
  updateNotificationPreferencesSchema,
} = require("../validators/notificationPreference.validator");

const router = Router();

router.use(requireAuth);

router.get("/business", requirePermission("Settings", "view"), getBusinessSettings);
router.patch(
  "/business",
  requirePermission("Settings", "edit"),
  validate(updateBusinessSettingsSchema),
  patchBusinessSettings
);
router.post(
  "/business/logo",
  requirePermission("Settings", "edit"),
  handleLogoUpload,
  postBusinessLogo
);

router.get(
  "/notifications",
  requirePermission("Settings", "view"),
  getNotificationPreferences
);
router.patch(
  "/notifications",
  requirePermission("Settings", "edit"),
  validate(updateNotificationPreferencesSchema),
  patchNotificationPreferences
);

module.exports = router;