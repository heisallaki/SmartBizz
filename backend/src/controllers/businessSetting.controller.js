const businessSettingService = require("../services/businessSetting.service");
const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const getBusinessSettings = asyncHandler(async (req, res) => {
  const settings = await businessSettingService.getBusinessSettings();
  ApiResponse.ok(res, settings);
});

const patchBusinessSettings = asyncHandler(async (req, res) => {
  const settings = await businessSettingService.updateBusinessSettings(req.body, req.user.id);
  ApiResponse.ok(res, settings);
});

const postBusinessLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest("No logo file was uploaded.");
  }

  const logoUrl = `${req.protocol}://${req.get("host")}/uploads/logos/${req.file.filename}`;

  const settings = await businessSettingService.updateBusinessSettings({ logoUrl }, req.user.id);
  ApiResponse.ok(res, settings);
});

module.exports = { getBusinessSettings, patchBusinessSettings, postBusinessLogo };