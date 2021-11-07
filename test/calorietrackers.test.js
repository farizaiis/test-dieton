const app = require('../server');
const supertest = require('supertest');

test('GET /v1/calorietrackers/', async () => {
    await supertest(app).post('/v1/users/register').send({
        fullName: 'Testing Test',
        email: 'testingtest@gmail.com',
        password: 'testingtest2',
        calorieSize: 1500,
        weight: 86,
        height: 175,
        waistline: 44,
        thigh: 50,
    });

    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'testingtest@gmail.com',
        password: 'testingtest2',
    });

    await supertest(app)
        .get('/v1/calorietrackers/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(typeof res.body).toBe('object');
        });
});

test('PUT /v1/calorietrackers/', async () => {
    await supertest(app).post('/v1/users/register').send({
        fullName: 'Testing Test',
        email: 'testingtest2@gmail.com',
        password: 'testingtest2',
        calorieSize: 1500,
        weight: 86,
        height: 175,
        waistline: 44,
        thigh: 50,
    });

    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'testingtest@gmail.com',
        password: 'testingtest2',
    });

    await supertest(app)
        .put('/v1/calorietrackers/updatecalorie')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            calorieSize: 2000,
        })
        .expect(200)
        .then((res) => {
            expect(res.body.status).toBe('success');
        });
});
