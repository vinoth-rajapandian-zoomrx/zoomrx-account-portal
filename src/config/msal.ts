import { PublicClientApplication, Configuration } from "@azure/msal-browser";

const msalConfig: Configuration = {
  auth: {
    clientId: "1b6fdafd-4c11-472d-9252-f22526e9e3a0",
    authority: "https://login.microsoftonline.com/33e5c76b-0eec-495e-9f32-93fad67196d2",
    redirectUri: typeof window !== "undefined" ? window.location.origin + (window.location.pathname.startsWith("/zoomrx-account-portal") ? "/zoomrx-account-portal" : "") : "",
  },
  cache: {
    cacheLocation: "localStorage",
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: ["User.Read"],
};
