const ACCESS_KEY = "bazario_access";
const REFRESH_KEY = "bazario_refresh";
const ROLE_KEY = "bazario_role";

export function getTokens() {
  return {
    access: localStorage.getItem(ACCESS_KEY),
    refresh: localStorage.getItem(REFRESH_KEY),
    role: localStorage.getItem(ROLE_KEY),
  };
}

export function setTokens({ access, refresh, role }) {
  if (access) localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  if (role) localStorage.setItem(ROLE_KEY, role);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ROLE_KEY);
}
