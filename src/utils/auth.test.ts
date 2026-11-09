/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAdminCredentials,
  createAdminToken,
  verifyAdminToken,
  revokeAdminToken,
  safeEqual,
} from './authServer.ts';

test('validateAdminCredentials correctly authenticates admin user', () => {
  const customConfig = {
    username: 'admin@vignan.edu',
    passwordHash: 'c5549177709c2960b5a8f457fac6d53295fef4814c0a9d0fd063a8af3654e502', // SHA-256 of TempoAdmin@2026
    sessionSecret: 'test-secret-salt-12345',
    tokenDurationMs: 3600000,
  };

  assert.equal(validateAdminCredentials('admin@vignan.edu', 'TempoAdmin@2026', customConfig), true);
  assert.equal(validateAdminCredentials('admin', 'TempoAdmin@2026', customConfig), true);
  assert.equal(validateAdminCredentials('ADMIN@VIGNAN.EDU', 'TempoAdmin@2026', customConfig), true);

  // Rejects invalid password
  assert.equal(validateAdminCredentials('admin@vignan.edu', 'wrong-pass', customConfig), false);
  // Rejects unauthorized username
  assert.equal(validateAdminCredentials('student@vignan.edu', 'TempoAdmin@2026', customConfig), false);
  // Rejects empty values
  assert.equal(validateAdminCredentials('', '', customConfig), false);
});

test('createAdminToken and verifyAdminToken roundtrip', () => {
  const customConfig = {
    username: 'admin@vignan.edu',
    passwordHash: 'c5549177709c2960b5a8f457fac6d53295fef4814c0a9d0fd063a8af3654e502',
    sessionSecret: 'test-secret-salt-12345',
    tokenDurationMs: 3600000,
  };

  const token = createAdminToken('admin@vignan.edu', customConfig);
  assert.ok(token.includes('.'));

  const result = verifyAdminToken(token, customConfig);
  assert.equal(result.valid, true);
  assert.equal(result.payload?.role, 'Administrator');
  assert.equal(result.payload?.username, 'admin@vignan.edu');
});

test('verifyAdminToken rejects tampered or expired tokens', () => {
  const customConfig = {
    username: 'admin@vignan.edu',
    passwordHash: 'hash',
    sessionSecret: 'test-secret-salt-12345',
    tokenDurationMs: 3600000,
  };

  const token = createAdminToken('admin@vignan.edu', customConfig);
  const tampered = token.slice(0, -4) + 'abcd';
  assert.equal(verifyAdminToken(tampered, customConfig).valid, false);

  // Expired token
  const expiredConfig = {
    ...customConfig,
    tokenDurationMs: -1000, // already expired
  };
  const expiredToken = createAdminToken('admin@vignan.edu', expiredConfig);
  const expiredResult = verifyAdminToken(expiredToken, expiredConfig);
  assert.equal(expiredResult.valid, false);
  assert.match(expiredResult.error || '', /expired/i);
});

test('revokeAdminToken invalidates session', () => {
  const customConfig = {
    username: 'admin@vignan.edu',
    passwordHash: 'hash',
    sessionSecret: 'test-secret-salt-12345',
    tokenDurationMs: 3600000,
  };

  const token = createAdminToken('admin@vignan.edu', customConfig);
  assert.equal(verifyAdminToken(token, customConfig).valid, true);

  revokeAdminToken(token);
  const res = verifyAdminToken(token, customConfig);
  assert.equal(res.valid, false);
  assert.match(res.error || '', /invalidated/i);
});
