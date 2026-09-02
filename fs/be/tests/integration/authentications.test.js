import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { app } from '../../src/server.js';

describe('Authentications Module Integration Tests', () => {
  describe('POST /api/auth - User Login', () => {
    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/auth')
        .send({ password: 'Password123!' });

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/auth')
        .send({ email: 'user@example.com' });

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });

    it('should return 400 when email format is invalid', async () => {
      const response = await request(app)
        .post('/api/auth')
        .send({
          email: 'not-an-email',
          password: 'Password123!',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('PUT /api/auth - Refresh Access Token', () => {
    it('should return 400 when refresh token is missing in cookie and body', async () => {
      const response = await request(app)
        .put('/api/auth')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('DELETE /api/auth - Logout', () => {
    it('should return 400 when refresh token is missing in cookie and body', async () => {
      const response = await request(app)
        .delete('/api/auth')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('GET /api/auth/verify-email - Verify Email Token', () => {
    it('should return 400 when token query is missing', async () => {
      const response = await request(app)
        .get('/api/auth/verify-email');

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('POST /api/auth/resend-verif - Resend Email Verification', () => {
    it('should return 401 when unauthenticated', async () => {
      const response = await request(app)
        .post('/api/auth/resend-verif');

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should return 401 when token is invalid', async () => {
      const response = await request(app)
        .post('/api/auth/resend-verif')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('POST /api/auth/reset-password - Send Reset Password Email', () => {
    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });

    it('should return 400 when email format is invalid', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ email: 'invalid-email-format' });

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });
});
