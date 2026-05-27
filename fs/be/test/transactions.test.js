import request from 'supertest';
import { describe, it, expect } from '@jest/globals';

const { app } = await import('../src/server.js');

describe('Transactions Service - HTTP Endpoint Validation', () => {
  // POST /api/transactions/upload — upload file belum ditest

  describe('POST /api/transactions/expense', () => {
    const expensePayload = {
      items: [
        {
          name: 'rambutan',
          unitPrice: 4000,
          detailType: 'product',
          quantity: 45,
        },
      ],
      transactionDate: '2024-01-15',
    };

    it('should return 401 when authorization header is missing', async () => {
      const response = await request(app)
        .post('/api/transactions/expense')
        .send(expensePayload);

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should return 401 when authorization token is invalid', async () => {
      const response = await request(app)
        .post('/api/transactions/expense')
        .set('Authorization', 'Bearer invalid-token')
        .send(expensePayload);

      expect(response.statusCode).toBe(401);
    });

    it('should return 401 when Authorization header format is wrong', async () => {
      const response = await request(app)
        .post('/api/transactions/expense')
        .set('Authorization', 'InvalidFormat')
        .send(expensePayload);

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /api/transactions/income', () => {
    const incomePayload = {
      totalAmount: 5000000,
      transactionDate: '2024-01-15',
    };

    it('should return 401 when authorization header is missing', async () => {
      const response = await request(app)
        .post('/api/transactions/income')
        .send(incomePayload);

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should return 401 when authorization token is invalid', async () => {
      const response = await request(app)
        .post('/api/transactions/income')
        .set('Authorization', 'Bearer invalid-token')
        .send(incomePayload);

      expect(response.statusCode).toBe(401);
    });

    it('should return 401 when Authorization header format is wrong', async () => {
      const response = await request(app)
        .post('/api/transactions/income')
        .set('Authorization', 'InvalidFormat')
        .send(incomePayload);

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/transactions/dashboard', () => {
    it('should return 401 when authorization header is missing', async () => {
      const response = await request(app)
        .get('/api/transactions/dashboard');

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should return 401 when authorization token is invalid', async () => {
      const response = await request(app)
        .get('/api/transactions/dashboard')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/transactions/history', () => {
    it('should return 401 when authorization header is missing', async () => {
      const response = await request(app)
        .get('/api/transactions/history');

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should return 401 when authorization token is invalid', async () => {
      const response = await request(app)
        .get('/api/transactions/history')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.statusCode).toBe(401);
    });
  });
});
