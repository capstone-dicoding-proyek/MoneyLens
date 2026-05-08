import request from 'supertest';
import { describe, it, expect } from '@jest/globals';

const { app } = await import('../src/server.js');

describe('Authentications Service - HTTP Endpoint Validation', () => {
  describe('POST /api/auth - Login', () => {
    it('should return 400 when email is missing', async () => {
      const loginData = {
        password: 'ValidPassword123',
      };

      const response = await request(app)
        .post('/api/auth')
        .send(loginData);

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });

    it('should return 400 when password is missing', async () => {
      const loginData = {
        email: 'user@example.com',
      };

      const response = await request(app)
        .post('/api/auth')
        .send(loginData);

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });

    it('should return 400 when email format is invalid', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'ValidPassword123',
      };

      const response = await request(app)
        .post('/api/auth')
        .send(loginData);

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('PUT /api/auth - Add Refresh Token (Get New Access Token)', () => {
    it('should return 400 when refresh token is missing', async () => {
      const response = await request(app)
        .put('/api/auth')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('DELETE /api/auth - Logout', () => {
    it('should return 400 when refresh token is missing', async () => {
      const response = await request(app)
        .delete('/api/auth')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('GET /api/auth/verify-email - Verify Email', () => {
    it('should return 400 when token is missing', async () => {
      const response = await request(app)
        .get('/api/auth/verify-email');

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('POST /api/auth/resend-verif - Resend Email Verification', () => {
    it('should return 401 when authorization header is missing', async () => {
      const response = await request(app)
        .post('/api/auth/resend-verif');

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should return 401 when authorization token is invalid', async () => {
      const response = await request(app)
        .post('/api/auth/resend-verif')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.statusCode).toBe(401);
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
      const resetData = {
        email: 'invalid-email',
      };

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send(resetData);

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });
});
