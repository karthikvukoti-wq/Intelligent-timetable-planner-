/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto from 'crypto';

export interface AdminPayload {
  sub: string;
  username: string;
  role: string;
  name: string;
  institution: string;
  iat: number;
  exp: number;
  sid: string;
}

export interface AuthConfig {
  username: string;
  passwordHash: string; // SHA-256 hash of expected password
  sessionSecret: string;
  tokenDurationMs: number;
}

// In-memory revoked sessions set for active logout invalidation
const revokedTokens = new Set<string>();

/**
 * Hash a string using SHA-256
 */
export function hashString(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/**
 * Secure constant-time comparison of two strings using SHA-256 digests
 */
export function safeEqual(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(hashString(a), 'utf-8');
  const bufB = Buffer.from(hashString(b), 'utf-8');
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Constant-time comparison of two already-hashed hex strings
 */
export function safeHashEqual(hashA: string, hashB: string): boolean {
  if (typeof hashA !== 'string' || typeof hashB !== 'string') return false;
  const bufA = Buffer.from(hashA, 'utf-8');
  const bufB = Buffer.from(hashB, 'utf-8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Get current auth configuration from environment variables
 */
export function getAuthConfig(): AuthConfig {
  const username = process.env.ADMIN_USERNAME || 'admin@vignan.edu';
  const rawPassword = process.env.ADMIN_PASSWORD || 'TempoAdmin@2026';
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'tempo-admin-session-secret-key-2026';

  return {
    username,
    passwordHash: hashString(rawPassword),
    sessionSecret,
    tokenDurationMs: 24 * 60 * 60 * 1000, // 24 hours
  };
}

/**
 * Validate admin credentials
 */
export function validateAdminCredentials(username: string, password: string, config = getAuthConfig()): boolean {
  if (!username || !password) return false;

  const trimmedUser = username.trim().toLowerCase();
  const configuredUser = config.username.trim().toLowerCase();

  // Allow either exact admin email or 'admin' alias
  const userMatches = safeEqual(trimmedUser, configuredUser) || safeEqual(trimmedUser, 'admin');
  if (!userMatches) return false;

  const inputPasswordHash = hashString(password);
  return safeHashEqual(inputPasswordHash, config.passwordHash);
}

/**
 * Create a signed admin session token
 */
export function createAdminToken(username: string, config = getAuthConfig()): string {
  const now = Date.now();
  const payload: AdminPayload = {
    sub: 'tempo_admin_user',
    username,
    role: 'Administrator',
    name: 'Academic Administrator',
    institution: 'Vignan University',
    iat: now,
    exp: now + config.tokenDurationMs,
    sid: crypto.randomBytes(16).toString('hex'),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const hmac = crypto
    .createHmac('sha256', config.sessionSecret)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${hmac}`;
}

/**
 * Verify and decode an admin session token
 */
export function verifyAdminToken(token: string, config = getAuthConfig()): { valid: boolean; payload: AdminPayload | null; error?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, payload: null, error: 'Token missing.' };
  }

  if (revokedTokens.has(token)) {
    return { valid: false, payload: null, error: 'Session has been invalidated.' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, payload: null, error: 'Malformed token structure.' };
  }

  const [payloadB64, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', config.sessionSecret)
    .update(payloadB64)
    .digest('base64url');

  const sigValid = safeEqual(signature, expectedSig);
  if (!sigValid) {
    return { valid: false, payload: null, error: 'Invalid token signature.' };
  }

  try {
    const jsonStr = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload: AdminPayload = JSON.parse(jsonStr);

    if (Date.now() > payload.exp) {
      return { valid: false, payload: null, error: 'Administrator session expired.' };
    }

    if (payload.role !== 'Administrator') {
      return { valid: false, payload: null, error: 'Insufficient administrative privileges.' };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, payload: null, error: 'Failed to parse session payload.' };
  }
}

/**
 * Invalidate an active session token (Logout)
 */
export function revokeAdminToken(token: string): void {
  if (token) {
    revokedTokens.add(token);
    // Limit memory usage
    if (revokedTokens.size > 10000) {
      const first = revokedTokens.values().next().value;
      if (first) revokedTokens.delete(first);
    }
  }
}
