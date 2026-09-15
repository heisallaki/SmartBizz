import api from "../../../config/api";

function extractErrorMessage(error, fallback) {
  if (!error.response) {
    return "Could not reach the server. Check that the API is running and reachable.";
  }
  return error.response.data?.message || fallback;
}

async function getBusinessSettings() {
  try {
    const { data } = await api.get("/settings/business");
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to load business settings."));
  }
}

async function updateBusinessSettings(payload) {
  try {
    const { data } = await api.patch("/settings/business", payload);
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to save business settings."));
  }
}

async function uploadLogo(file) {
  try {
    const formData = new FormData();
    formData.append("logo", file);

    const { data } = await api.post("/settings/business/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Failed to upload logo."), { cause: error });
  }
}

const businessSettingsService = {
  getBusinessSettings,
  updateBusinessSettings,
  uploadLogo,
};

export default businessSettingsService;