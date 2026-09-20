import { useCallback, useEffect, useMemo, useState } from "react";

import { generalSettings as initialSettings } from "../data/settingsData";
import * as settingsService from "../services/settings.service";
import businessSettingsService from "../services/businessSettings.service";

export default function useGeneralSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState("");

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        const data = await settingsService.getGeneralSettings();
        if (active) setSettings(data);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));
  }, []);

  const handleLogoChange = useCallback(async (file) => {
    if (!file) return;

    setLogoUploading(true);
    setLogoError("");

    try {
      const updated = await businessSettingsService.uploadLogo(file);

      setSettings((previous) => ({
        ...previous,
        businessLogo: updated.logoUrl ?? "",
      }));
    } catch (error) {
      setLogoError(error.message);
    } finally {
      setLogoUploading(false);
    }
  }, []);

  const removeLogo = useCallback(() => {
    setSettings((previous) => ({
      ...previous,
      businessLogo: "",
    }));
  }, []);

  const reset = useCallback(() => {
    setSettings(initialSettings);
  }, []);

  const update = useCallback((values) => {
    setSettings((previous) => ({
      ...previous,
      ...values,
    }));
  }, []);

  const hasLogo = useMemo(() => Boolean(settings.businessLogo), [settings.businessLogo]);

  return {
    settings,
    loading,

    hasLogo,
    logoUploading,
    logoError,

    update,
    reset,

    handleInputChange,
    handleLogoChange,
    removeLogo,
  };
}