// Global ENV file for all environment variables

//PORTS LIST

export const PORT_GLOBAL_API = 9001;

//CONFIG LIST

export const CONFIG_HTTP_MODE = "http";

//API LIST

export const API_GLOBAL_GQL = "gitconvexapi";

export const globalAPIEndpoint = `${CONFIG_HTTP_MODE}://${window.location.hostname}:${PORT_GLOBAL_API}/${API_GLOBAL_GQL}`;

// ROUTED FOR GLOBAL API

export const ROUTE_HEALTH_CHECK = "HEALTH_CHECK";
export const ROUTE_FETCH_REPO = "FETCH_REPO";
export const ROUTE_ADD_REPO = "ADD_REPO";
export const ROUTE_REPO_DETAILS = "REPO_DETAILS";
export const ROUTE_REPO_TRACKED_DIFF = "REPO_TRACKED_DIFF";
export const ROUTE_REPO_FILE_DIFF = "REPO_FILE_DIFF";
export const ROUTE_REPO_COMMIT_LOGS = "COMMIT_LOGS";
