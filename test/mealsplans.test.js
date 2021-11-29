const app = require('../server');
const supertest = require('supertest');
const moment = require('moment');
moment.suppressDeprecationWarnings = true;
const today = moment(new Date()).format('YYYY-M-D');

test('POST /v1/mealsplan/', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    const data = {
        mealsTime: 'Breakfast',
        date: today,
    };

    await supertest(app)
        .post('/v1/mealsplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(data)
        .expect(200)
        .then((res) => {
            expect(res.body.data.mealsTime).toBe(data.mealsTime);
            expect(res.body.data.date).toBe(data.date);
        });
});

test('GET /v1/mealsplan/', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    const data = {
        mealsTime: 'Lunch',
        date: today,
    };

    await supertest(app)
        .post('/v1/mealsplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(data);

    await supertest(app)
        .get('/v1/mealsplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

test('GET /v1/mealsplan?date=', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    const data = {
        mealsTime: 'Dinner',
        date: today,
    };

    const create = await supertest(app)
        .post('/v1/mealsplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(data);

    await supertest(app)
        .get('/v1/mealsplan?date=' + create.body.data.date)
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

test('PUT /v1/mealsplan/status', async () => {
    const token = await supertest(app).post('/v1/users/register').send({
        fullName: 'Testing Test',
        email: 'testingmeals@gmail.com',
        password: 'unittesting',
        calorieSize: 1500,
        weight: 86,
        height: 175,
        waistline: 44,
        thigh: 50,
    });

    const data = {
        mealsTime: 'Lunch',
        date: today,
    };

    const create = await supertest(app)
        .post('/v1/mealsplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(data);

    await supertest(app)
        .put(
            '/v1/mealsplan/status?type=' +
                create.body.data.mealsTime +
                '&date=' +
                create.body.data.date
        )
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(res.body.status).toBe('success');
        });
});

test('DELETE /v1/mealsplan/:id', async () => {
    const token = await supertest(app).post('/v1/users/register').send({
        fullName: 'Testing Test',
        email: 'testingmeals2@gmail.com',
        password: 'unittesting',
        calorieSize: 1500,
        weight: 86,
        height: 175,
        waistline: 44,
        thigh: 50,
    });

    const adminLog = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    }); 

    const data = {
        mealsTime: 'Lunch',
        date: today,
    };

    const create = await supertest(app)
        .post('/v1/mealsplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(data);

    await supertest(app)
        .delete('/v1/mealsplan/' + create.body.data.id)
        .set('Authorization', 'Bearer ' + adminLog.body.token)
        .expect(200)
        .then((res) => {
            expect(res.body.status).toBe('success');
        });
});