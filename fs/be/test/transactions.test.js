import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';

const { app } = await import('../src/server.js');

describe('Transactions Service - HTTP Endpoint Validation', () => {
    describe('POST /api/transactions - Add Transactions', () => {
        let accessToken;
        beforeAll(async () => {
            const loginResponse = await request(app)
                .post('/api/auth')
                .send({
                    email: 'tes@gmail.com',
                    password: '123456789'
                });
            accessToken =
                loginResponse.body.data.accessToken;

        });

        it.only('should return 201 when create', async () => {
            const transactionData = {
                items: [
                    {
                        name: 'rambutan',
                        unitPrice: 4000,
                        quantity: 45
                    }
                ],
                transactionDate: '2024-01-15'
            };

            const response = await request(app)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(transactionData);
            console.log(response);
            
            expect(response.statusCode).toBe(201);
            expect(response.body.status).toBe('success');
        });

        it('should return 401 when authorization header is missing', async () => {
            const transactionData = {
                items: [
                    {
                        categoryId: '1',
                        amount: 50000,
                        description: 'Grocery shopping',
                        type: 'expense'
                    }
                ],
                transactionDate: '2024-01-15'
            };

            const response = await request(app)
                .post('/api/transactions')
                .send(transactionData);

            expect(response.statusCode).toBe(401);
            expect(response.body.status).toBe('fail');
        });

        it('should return 401 when authorization token is invalid', async () => {
            const transactionData = {
                items: [
                    {
                        categoryId: '1',
                        amount: 50000,
                        description: 'Grocery shopping',
                        type: 'expense'
                    }
                ],
                transactionDate: '2024-01-15'
            };

            const response = await request(app)
                .post('/api/transactions')
                .set('Authorization', 'Bearer invalid-token')
                .send(transactionData);

            expect(response.statusCode).toBe(401);
        });

        it('should return 401 when no bearer token provided', async () => {
            const transactionData = {
                items: [],
                transactionDate: '2024-01-15'
            };

            const response = await request(app)
                .post('/api/transactions')
                .set('Authorization', 'InvalidFormat')
                .send(transactionData);

            expect(response.statusCode).toBe(401);
        });
    });



});