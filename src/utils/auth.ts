const TOKEN_KEY = 'myadmin_token';
const USERNAME_KEY = 'myadmin_user';

export function getToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsername(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(USERNAME_KEY);
}

export function setAuth(token: string, username: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  try {
    // Decode the payload (not verifying signature — server does that)
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Check expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      clearAuth();
      return false;
    }
    return true;
  } catch {
    clearAuth();
    return false;
  }
}
