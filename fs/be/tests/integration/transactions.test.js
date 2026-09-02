import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { app } from '../../src/server.js';

describe('Transactions Module Integration Tests', () => {
  describe('POST /api/transactions/expense - Create Expense', () => {
    const expensePayload = {
      items: [
        {
          name: 'Makan Siang',
          unitPrice: 25000,
          detailType: 'food_drink',
          quantity: 2,
        },
      ],
      transactionDate: '2026-09-01',
    };

    it('should return 401 when unauthenticated', async () => {
      const response = await request(app)
        .post('/api/transactions/expense')
        .send(expensePayload);

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should return 401 when token is invalid', async () => {
      const response = await request(app)
        .post('/api/transactions/expense')
        .set('Authorization', 'Bearer invalid-token')
        .send(expensePayload);

      expect(response.statusCode).toBe(401);
    });

    it('should return 401 when Authorization header format is malformed', async () => {
      const response = await request(app)
        .post('/api/transactions/expense')
        .set('Authorization', 'InvalidFormat')
        .send(expensePayload);

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /api/transactions/income - Create Income', () => {
    const incomePayload = {
      totalAmount: 5000000,
      nameIncome: 'Gaji Bulanan',
      transactionDate: '2026-09-01',
    };

    it('should return 401 when unauthenticated', async () => {
      const response = await request(app)
        .post('/api/transactions/income')
        .send(incomePayload);

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should return 401 when token is invalid', async () => {
      const response = await request(app)
        .post('/api/transactions/income')
        .set('Authorization', 'Bearer invalid-token')
        .send(incomePayload);

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/transactions/dashboard - Retrieve Dashboard Metrics', () => {
    it('should return 401 when unauthenticated', async () => {
      const response = await request(app)
        .get('/api/transactions/dashboard');

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should return 401 when token is invalid', async () => {
      const response = await request(app)
        .get('/api/transactions/dashboard')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/transactions/history - Retrieve History Transactions', () => {
    it('should return 401 when unauthenticated', async () => {
      const response = await request(app)
        .get('/api/transactions/history');

      expect(response.statusCode).toBe(401);
      expect(response.body.status).toBe('fail');
    });

    it('should return 401 when token is invalid', async () => {
      const response = await request(app)
        .get('/api/transactions/history')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.statusCode).toBe(401);
    });
  });
});
