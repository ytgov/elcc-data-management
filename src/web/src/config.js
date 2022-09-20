export const applicationName = "ELCC Data Management";
export const applicationOwner = "Department of Education";

export const environment = process.env.NODE_ENV;
export const apiBaseUrl = process.env.NODE_ENV == "production" ? "" : "http://localhost:3000";
export const applicationUrl = process.env.VUE_APP_FRONTEND_URL || "http://localhost:8080";
export const apiConfigUrl = process.env.NODE_ENV == "production" ? "/api/config" : "http://localhost:3000/api/config";
