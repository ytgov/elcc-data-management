
export const applicationName = "Signing Authorities";
export const applicationIcon = "mdi-cash-register";
export const hasSidebar = true;
export const hasSidebarClosable = false;

export const sections = [
    {
        name: "Dashboard",
        url: "/dashboard",
        icon: "mdi-view-dashboard"
    },
    {
        name: "Vendors",
        url: "/vendors",
        icon: "mdi-domain"
    }
];
export const environment = process.env.NODE_ENV;
export const apiBaseUrl = process.env.NODE_ENV == "production" ? "" : "http://localhost:3000";
export const applicationUrl = process.env.VUE_APP_FRONTEND_URL || "http://localhost:8080";
export const apiConfigUrl = process.env.NODE_ENV == "production" ? "/api/config" : "http://localhost:3000/api/config";
