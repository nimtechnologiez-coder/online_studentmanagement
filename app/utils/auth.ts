export const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000; // 48 hours in milliseconds

export interface StoredPrincipalData {
  id: number | string;
  principal_name?: string;
  college_id?: number | string;
  college_name?: string;
  token?: string;
  login_time?: number;
  expires_at?: number;
  [key: string]: any;
}

export function getStoredPrincipal(): { expired: boolean; data: StoredPrincipalData | null } {
  if (typeof window === "undefined") {
    return { expired: false, data: null };
  }

  const saved = localStorage.getItem("principal") || sessionStorage.getItem("principal");
  if (!saved) {
    return { expired: false, data: null };
  }

  try {
    const parsed: StoredPrincipalData = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object") {
      clearStoredPrincipal();
      return { expired: false, data: null };
    }

    const now = Date.now();
    const loginTime = parsed.login_time || (parsed as any).loginTimestamp;
    
    // If expires_at is present, use it. Otherwise if login_time is present, compute it.
    // If neither is present, set expires_at based on creation so legacy logins expire in 2 days.
    const expiresAt = parsed.expires_at || (loginTime ? loginTime + TWO_DAYS_MS : null);

    if (expiresAt && now > expiresAt) {
      clearStoredPrincipal();
      return { expired: true, data: parsed };
    }

    return { expired: false, data: parsed };
  } catch (e) {
    clearStoredPrincipal();
    return { expired: false, data: null };
  }
}

export function clearStoredPrincipal(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("principal");
  sessionStorage.removeItem("principal");
}

export function saveStoredPrincipal(data: any, remember: boolean): StoredPrincipalData {
  const now = Date.now();
  const expiresAt = now + TWO_DAYS_MS;
  const token = data?.token || `token_${data?.id || 'principal'}_${now}_${Math.random().toString(36).substring(2, 9)}`;

  const principalData: StoredPrincipalData = {
    ...data,
    token,
    login_time: now,
    expires_at: expiresAt,
  };

  clearStoredPrincipal();

  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("principal", JSON.stringify(principalData));

  return principalData;
}
