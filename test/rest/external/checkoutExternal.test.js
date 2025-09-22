const request = require('supertest');
const { expect, use } = require('chai');

const chaiExclude = require('chai-exclude');
use(chaiExclude)

require('dotenv').config();

describe('Checkout', () => {
    describe('POST /api/checkout', () => {
        before(async () => {
            const respostaLogin = await request(process.env.BASE_URL_REST)
                .post('/api/users/login')
                .send({
                    email: 'alice@email.com',
                    password: '123456'
                });

            token = respostaLogin.body.token;
        });
       
        it('Quando informo um produto inexistente recebo 400', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
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
        });

        it('Quando informo uma transacao valida espero 200', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/api/checkout')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    items: [{ productId: 1, quantity: 2 }],
                    freight: 20,
                    paymentMethod: 'credit_card',
                    cardData: {
                        number: '4111111111111111',
                        name: 'Alice',
                        expiration: '12/30',
                        cvv: '123'
                    }
                });
            expect(resposta.status).to.equal(200);
        });

    });
});