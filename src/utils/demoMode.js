import STORAGE_KEYS from "../constants/storageKeys";
import DEMO_USER, { DEMO_TOKEN } from "../demo/demoUser";
import { resetDemoStore } from "../demo/demoStore";

export function isDemoMode() {
  return localStorage.getItem(STORAGE_KEYS.DEMO) === "true";
}

export function startDemoSession(login) {
  resetDemoStore();
  localStorage.setItem(STORAGE_KEYS.DEMO, "true");
  login(DEMO_USER, DEMO_TOKEN);
}

export function clearDemoFlag() {
  localStorage.removeItem(STORAGE_KEYS.DEMO);
}

export function endDemoSession(logout) {
  logout();
  setTimeout(clearDemoFlag, 0);
}