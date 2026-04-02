/**
 * Security API service for 2FA and password reset.
 * Replace with actual API calls when backend is ready.
 */

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const TWO_FA_ISSUER = 'Caelo';
const TOTP_STEP_SECONDS = 30;
const TOTP_DIGITS = 6;

function normalizeSecret(secret) {
  return String(secret || '')
    .toUpperCase()
    .replace(/[^A-Z2-7]/g, '');
}

function toBase32Secret(length = 32) {
  const values = new Uint8Array(length);
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(values);
  } else {
    for (let i = 0; i < length; i += 1) {
      values[i] = Math.floor(Math.random() * 256);
    }
  }

  let secret = '';
  for (let i = 0; i < length; i += 1) {
    secret += BASE32_CHARS[values[i] % BASE32_CHARS.length];
  }
  return secret;
}

function base32ToBytes(secret) {
  const normalized = normalizeSecret(secret);
  let bits = 0;
  let value = 0;
  const output = [];

  for (let i = 0; i < normalized.length; i += 1) {
    const index = BASE32_CHARS.indexOf(normalized[i]);
    if (index === -1) continue;
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  return new Uint8Array(output);
}

async function getTotpCode(secret, counter) {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.subtle) {
    throw new Error('Secure code generation is not supported in this browser');
  }

  const key = await cryptoApi.subtle.importKey(
    'raw',
    base32ToBytes(secret),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign'],
  );

  const counterBytes = new Uint8Array(8);
  for (let i = 7; i >= 0; i -= 1) {
    counterBytes[i] = counter & 0xff;
    counter = Math.floor(counter / 256);
  }

  const hmac = new Uint8Array(await cryptoApi.subtle.sign('HMAC', key, counterBytes));
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return String(binary % 10 ** TOTP_DIGITS).padStart(TOTP_DIGITS, '0');
}

export function buildOtpAuthUri(secret, accountName, issuer = TWO_FA_ISSUER) {
  const safeSecret = normalizeSecret(secret);
  const safeIssuer = String(issuer || TWO_FA_ISSUER).trim() || TWO_FA_ISSUER;
  const safeAccount = String(accountName || 'account').trim() || 'account';
  const label = `${encodeURIComponent(safeIssuer)}:${encodeURIComponent(safeAccount)}`;
  const query = new URLSearchParams({
    secret: safeSecret,
    issuer: safeIssuer,
    algorithm: 'SHA1',
    digits: String(TOTP_DIGITS),
    period: String(TOTP_STEP_SECONDS),
  });

  return `otpauth://totp/${label}?${query.toString()}`;
}

/** Generate 2FA secret â€“ returns base32 secret for TOTP */
export async function generate2FASecret() {
  // In production, this should come from the backend.
  return toBase32Secret(32);
}

/** Verify 6-digit TOTP code */
export async function verify2FACode(secret, code) {
  if (!/^\d{6}$/.test(code)) return { success: false, error: 'Invalid code format' };

  const normalizedSecret = normalizeSecret(secret);
  if (!normalizedSecret) {
    return { success: false, error: '2FA secret is missing' };
  }

  try {
    const timeCounter = Math.floor(Date.now() / 1000 / TOTP_STEP_SECONDS);
    for (const offset of [-1, 0, 1]) {
      const expected = await getTotpCode(normalizedSecret, timeCounter + offset);
      if (expected === code) {
        return { success: true };
      }
    }
    return { success: false, error: 'Invalid or expired code' };
  } catch (error) {
    return { success: false, error: error?.message || 'Verification failed' };
  }
}

/** Enable 2FA for account */
export async function enable2FA(secret, code) {
  const verify = await verify2FACode(secret, code);
  if (!verify.success) return verify;
  // Placeholder: call POST /api/security/2fa/enable
  return { success: true };
}

/** Disable 2FA */
export async function disable2FA() {
  // Placeholder: call POST /api/security/2fa/disable
  return { success: true };
}

/** Change password */
export async function changePassword(currentPassword, newPassword) {
  // Placeholder: call POST /api/security/password/change
  if (!currentPassword || !newPassword) {
    return { success: false, error: 'All fields are required' };
  }
  return { success: true };
}
