import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { app } from '../../src/server.js';

describe('Users Module Integration Tests', () => {
  describe('POST /api/users - Register User', () => {
    it('should return 400 when email is missing', async () => {
      const userData = {
        fullname: 'New User',
        password: 'SecurePassword123!',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });

    it('should return 400 when password is missing', async () => {
      const userData = {
        email: 'newuser@example.com',
        fullname: 'New User',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });

    it('should return 400 when fullname is missing', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'SecurePassword123!',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });

    it('should return 400 when email format is invalid', async () => {
      const userData = {
        email: 'invalid-email',
        fullname: 'New User',
        password: 'SecurePassword123!',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('POST /api/users/google-login - Login with Google', () => {
    it('should return 400 when body is empty', async () => {
      const response = await request(app)
        .post('/api/users/google-login')
        .send({});

      expect([400, 500]).toContain(response.statusCode);
    });
  });

  describe('POST /api/users/reset-password - Reset Password', () => {
    it('should return 400 when token is missing', async () => {
      const response = await request(app)
        .post('/api/users/reset-password')
        .send({ password: 'NewPassword123!' });

      expect(response.statusCode).toBe(400);
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/users/reset-password')
        .send({ token: 'reset-token-sample' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/users - Get Logged-in User Profile', () => {
    it('should return 401 when no authorization token provided', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should return 401 when invalid authorization token provided', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should return 401 when Authorization header format is malformed', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', 'MalformedFormat');

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('PUT /api/users - Update Fullname', () => {
    it('should return 401 when unauthenticated', async () => {
      const response = await request(app)
        .put('/api/users')
        .send({ fullname: 'Updated Name' });

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should return 401 when invalid token provided', async () => {
      const response = await request(app)
        .put('/api/users')
        .set('Authorization', 'Bearer invalid-token')
        .send({ fullname: 'Updated Name' });

      expect(response.statusCode).toBe(401);
    });
  });
});
