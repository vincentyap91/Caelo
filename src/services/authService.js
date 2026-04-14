/**
 * Auth API service – login and 2FA verification.
 * Replace with actual API calls when backend is ready.
 */

/** Verify username/password – returns session context if 2FA required */
export async function verifyLogin(username, password) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Placeholder: in production, call POST /api/auth/login
  if (!username?.trim() || !password) {
    return { success: false, error: 'Username and password are required' };
  }

  // Demo: "fail" username triggers error
  if (username.toLowerCase() === 'fail' || password === 'error') {
    return { success: false, error: 'Invalid username or password' };
  }

  // Demo: username "2fa" triggers 2FA step
  const requires2FA = username.toLowerCase().includes('2fa');
  return {
    success: true,
    requires2FA,
    sessionId: requires2FA ? `sess_${Date.now()}` : null,
    username: username.trim(),
  };
}

/** Verify 6-digit 2FA code for login completion */
export async function verify2FALogin(sessionId, code, trustDevice = false) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Placeholder: in production, call POST /api/auth/2fa/verify
  if (!sessionId || !code) {
    return { success: false, error: 'Session and code are required' };
  }
  if (!/^\d{6}$/.test(code)) {
    return { success: false, error: 'Please enter a valid 6-digit code' };
  }
  return {
    success: true,
    user: { name: 'demo', balance: 'MYR 0.00', notifications: 1, vipLevel: 'Diamond' },
  };
}

/** WhatsApp login integration point. Hook real deep link / backend flow here when ready. */
export async function loginWithWhatsApp() {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Placeholder: in production, open WhatsApp auth flow or call POST /api/auth/whatsapp
  return {
    success: false,
    notImplemented: true,
    error: 'WhatsApp login is not available yet.',
  };
}
