const app = require('../server');
const supertest = require('supertest');

test('POST /v1/wms/', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    const data = {
        weight: 70,
        waistline: 30,
        thigh: 40,
        date: '2021-11-06',
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
        date: '2021-11-06',
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
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    await supertest(app)
        .delete('/v1/wms/2')
        .set('Authorization', 'Bearer ' + token.body.token);

    const create = await supertest(app)
        .post('/v1/wms/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            weight: 70,
            waistline: 30,
            thigh: 40,
            date: '2021-11-06',
        });

    await supertest(app)
        .delete('/v1/wms/' + create.body.data.id)
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
            date: '2021-11-06',
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
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    await supertest(app)
        .delete('/v1/wms/4')
        .set('Authorization', 'Bearer ' + token.body.token);

    const create = await supertest(app)
        .post('/v1/wms/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            weight: 70,
            waistline: 30,
            thigh: 40,
            date: '2021-11-06',
        });

    await supertest(app)
        .get('/v1/wms?date=' + create.body.data.date)
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(res.body.data.weight).toBe(create.body.data.weight);
            expect(res.body.data.waistline).toBe(create.body.data.waistline);
            expect(res.body.data.thigh).toBe(create.body.data.thigh);
            expect(res.body.data.date).toBe(create.body.data.date);
        });
});

test('GET /v1/wms/:date', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    await supertest(app)
        .delete('/v1/wms/5')
        .set('Authorization', 'Bearer ' + token.body.token);

    await supertest(app)
        .post('/v1/wms/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            weight: 70,
            waistline: 30,
            thigh: 40,
            date: '2021-11-06',
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