const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

const app = require('../../../rest/app');


const checkoutService = require('../../../src/services/checkoutService');

describe('Checkout Controller', () => {
    describe('POST /api/checkout', () => {

        beforeEach(async () => {
            const respostaLogin = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'alice@email.com',
                    password: '123456'
                });

            token = respostaLogin.body.token;
        });

        it('Usando mock: produto inexistente retorna 400', async () => {
            const stub = sinon.stub(checkoutService, 'checkout');
            stub.throws(new Error('Produto não encontrado'));

            const resposta = await request(app)
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    items: [{ productId: 3, quantity: 1 }],
                    freight: 20,
                    paymentMethod: 'credit_card',
                    cardData: {
                        number: '4111111111111111',
                        name: 'Alice',
                        expiration: '12/30',
                        cvv: '123'
                    }
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('error', 'Produto não encontrado');
            stub.restore();
        });

        afterEach(() => {
            sinon.restore();
        })
    });
});