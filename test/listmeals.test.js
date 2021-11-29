const app = require('../server');
const supertest = require('supertest');
const moment = require('moment');
moment.suppressDeprecationWarnings = true;
const today = moment(new Date()).format('YYYY-M-D');

test('POST /v1/listmeals', async () => {
    const token = await supertest(app).post('/v1/users/register').send({
        fullName: 'Testing Test',
        email: 'testinglist1@gmail.com',
        password: 'unittesting',
        calorieSize: 1500,
        weight: 86,
        height: 175,
        waistline: 44,
        thigh: 50,
    });

    const dataMealsPlan = await supertest(app)
        .post('/v1/mealsplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            mealsTime: 'Breakfast',
            date: today,
        });

    const id = 2;

    const getFood = await supertest(app)
        .get('/v1/foods/' + id)
        .set('Authorization', 'Bearer ' + token.body.token);

    const data = {
        mealsPlanId: dataMealsPlan.body.data.id,
        foodId: 2,
        qty: 1,
    };

    await supertest(app)
        .post('/v1/listmeals')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(data)
        .expect(200)
        .then((res) => {
            expect(res.body.data.mealsPlanId).toBe(data.mealsPlanId);
            expect(res.body.data.foodId).toBe(data.foodId);
            expect(res.body.data.qty).toBe(data.qty);
            expect(res.body.data.calAmount).toBe(
                getFood.body.data.calorie * data.qty
            );
        });
});

test('GET /v1/listmeals', async () => {
    const token = await supertest(app).post('/v1/users/register').send({
        fullName: 'Testing Test',
        email: 'testinglist2@gmail.com',
        password: 'unittesting',
        calorieSize: 1500,
        weight: 86,
        height: 175,
        waistline: 44,
        thigh: 50,
    });

    await supertest(app)
        .get('/v1/listmeals')
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

test('DELETE /v1/listmeals/:id', async () => {
    const token = await supertest(app).post('/v1/users/register').send({
        fullName: 'Testing Test',
        email: 'testinglist3@gmail.com',
        password: 'unittesting',
        calorieSize: 1500,
        weight: 86,
        height: 175,
        waistline: 44,
        thigh: 50,
    });

    const dataMealsPlan = await supertest(app)
        .post('/v1/mealsplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            mealsTime: 'Lunch',
            date: today,
        });

    const getFood = await supertest(app)
        .get('/v1/foods/' + 2)
        .set('Authorization', 'Bearer ' + token.body.token);

    await supertest(app)
        .post('/v1/listmeals')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            mealsPlanId: dataMealsPlan.body.data.id,
            foodId: getFood.body.data.id,
            qty: 1,
        });

    await supertest(app)
        .delete('/v1/listmeals/' + 1)
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(res.body.status).toBe('success');
        });
});

test('PUT /v1/listmeals/:id', async () => {
    const token = await supertest(app).post('/v1/users/register').send({
        fullName: 'Testing Test',
        email: 'testinglist4@gmail.com',
        password: 'unittesting',
        calorieSize: 1500,
        weight: 86,
        height: 175,
        waistline: 44,
        thigh: 50,
    });

    const dataMealsPlan = await supertest(app)
        .post('/v1/mealsplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            mealsTime: 'Dinner',
            date: today,
        });

    await supertest(app)
        .post('/v1/listmeals')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            mealsPlanId: dataMealsPlan.body.data.id,
            foodId: 1,
            qty: 1,
        });

    await supertest(app)
        .put('/v1/listmeals/' + 2)
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            qty: 1,
        })
        .expect(200)
        .then((res) => {
            expect(res.body.status).toBe('success');
        });
});
