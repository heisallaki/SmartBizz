import ROLES from "../constants/roles";

export const DEMO_TOKEN = "demo-mode-token";

export const DEMO_USER = {
  id: 9001,
  fullName: "Demo Visitor",
  name: "Demo Visitor",
  email: "demo@smartbizz.com",
  phone: "+254700000000",
  role: ROLES.ADMIN,
  status: "Active",
  avatarUrl: "",
  lastLoginAt: new Date().toISOString(),
  createdAt: "2026-01-01T08:00:00Z",
  updatedAt: new Date().toISOString(),
};

export default DEMO_USER;