const app = require('../server');
const supertest = require('supertest');
const moment = require('moment');
moment.suppressDeprecationWarnings = true;
const today = moment(new Date()).format('YYYY-M-D');

test('POST /v1/wms/', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    const data = {
        weight: 70,
        waistline: 30,
        thigh: 40,
        date: today
    };

    const create = await supertest(app)
        .post('/v1/wms/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(data)
        .expect(200)
        .then((res) => {
            expect(res.body.data.weight).toBe(data.weight);
            expect(res.body.data.waistline).toBe(data.waistline);
            expect(res.body.data.thigh).toBe(data.thigh);
            expect(res.body.data.date).toBe(data.date);
        });
});

test('PUT /v1/wms?date=', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    await supertest(app)
        .delete('/v1/wms/1')
        .set('Authorization', 'Bearer ' + token.body.token);

    const data = {
        weight: 70,
        waistline: 30,
        thigh: 40,
        date: today
    };

    await supertest(app)
        .post('/v1/wms/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(data);

    const dataUpdate = {
        weight: 70,
        waistline: 30,
        thigh: 40,
    };

    await supertest(app)
        .put('/v1/wms?date=' + data.date)
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(dataUpdate)
        .expect(200)
        .then((res) => {
            expect(res.body.status).toBe('Success');
        });
});

test('DELETE /v1/wms/:id', async () => {
    const createUser = await supertest(app).post('/v1/users/register').send({
        fullName: 'Fariz',
        email: 'testwnm@gmail.com',
        password: 'testbaru',
        calorieSize: 1500,
        weight: 86,
        height: 175,
        waistline: 44,
        thigh: 50,
    })

    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    await supertest(app)
        .delete('/v1/wms/' + createUser.body.dataWeight.id)
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(res.body.status).toBe('Success');
        });
});

test('GET /v1/wms/', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    await supertest(app)
        .post('/v1/wms/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            weight: 70,
            waistline: 30,
            thigh: 40,
            date: today
        });

    await supertest(app)
        .get('/v1/wms/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

test('GET /v1/wms?date=', async () => {
    const createUser = await supertest(app).post('/v1/users/register').send({
        fullName: 'Fariz',
        email: 'testwnm2@gmail.com',
        password: 'testbaru',
        calorieSize: 1500,
        weight: 86,
        height: 175,
        waistline: 44,
        thigh: 50,
    })

    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'testwnm2@gmail.com',
        password: 'testbaru'
    });

    await supertest(app)
        .get('/v1/wms?date=' + today)
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(res.body.data.weight).toBe(createUser.body.dataWeight.weight);
            expect(res.body.data.waistline).toBe(createUser.body.dataWeight.waistline);
            expect(res.body.data.thigh).toBe(createUser.body.dataWeight.thigh);
            expect(res.body.data.date).toBe(createUser.body.dataWeight.date);
        });
});

test('GET /v1/wms/:date', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    const month = '2010-11';

    await supertest(app)
        .get('/v1/wms/' + month)
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});
