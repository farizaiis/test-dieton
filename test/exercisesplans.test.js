const app = require('../server');
const supertest = require('supertest');
const moment = require('moment');
moment.suppressDeprecationWarnings = true;
const today = moment(new Date()).format('YYYY-M-D');

test('POST /v1/exercisesplan/', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    const exercisesData = await supertest(app)
        .post('/v1/exercises/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            name: 'Create Data Test 2',
            calorie: 130,
            logoExercise:
                'https://res.cloudinary.com/dejongos/image/upload/v1634276426/profilePic/default.png',
        });

    const data = {
        exerciseId: exercisesData.body.data.id,
        long: 20,
        time: 'Hours',
        alert: '01:00',
        date: today,
    };

    await supertest(app)
        .post('/v1/exercisesplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(data)
        .expect(200)
        .then((res) => {
            expect(res.body.data.exerciseId).toBe(data.exerciseId);
            expect(res.body.data.long).toBe(data.long);
            expect(res.body.data.time).toBe(data.time);
            expect(res.body.data.calAmount).toBe(
                exercisesData.body.data.calorie * data.long
            );
            expect(res.body.data.date).toBe(data.date);
        });
});

test('POST /v1/exercisesplan/', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    const exercisesData = await supertest(app)
        .post('/v1/exercises/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            name: 'Create Data 3',
            calorie: 130,
            logoExercise:
                'https://res.cloudinary.com/dejongos/image/upload/v1634276426/profilePic/default.png',
        });

    const data = {
        exerciseId: exercisesData.body.data.id,
        long: 20,
        time: 'Minutes',
        alert: '02:00',
        date: today,
    };

    await supertest(app)
        .post('/v1/exercisesplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(data)
        .expect(200)
        .then((res) => {
            expect(res.body.data.exerciseId).toBe(data.exerciseId);
            expect(res.body.data.long).toBe(data.long);
            expect(res.body.data.time).toBe(data.time);
            expect(res.body.data.calAmount).toBe(
                Math.round((exercisesData.body.data.calorie / 60) * data.long)
            );
            expect(res.body.data.date).toBe(data.date);
        });
});

test('DELETE /v1/exercisesplan/:id', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    const exercisesData = await supertest(app)
        .post('/v1/exercises/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            name: 'Create Data 12',
            calorie: 130,
            logoExercise:
                'https://res.cloudinary.com/dejongos/image/upload/v1634276426/profilePic/default.png',
        });

    const exercisesPlanData = await supertest(app)
        .post('/v1/exercisesplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            exerciseId: exercisesData.body.data.id,
            long: 20,
            time: 'Minutes',
            alert: '03:00',
            date: today,
        });

    await supertest(app)
        .delete('/v1/exercisesplan/' + exercisesPlanData.body.data.id)
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(res.body.status).toBe('success');
        });
});

test('GET /v1/exercisesplan/', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    await supertest(app)
        .get('/v1/exercisesplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

test('GET /v1/exercisesplan?date=', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    const exercisesData = await supertest(app)
        .post('/v1/exercises/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            name: 'Create Data 20',
            calorie: 130,
            logoExercise:
                'https://res.cloudinary.com/dejongos/image/upload/v1634276426/profilePic/default.png',
        });

    const data = {
        exerciseId: exercisesData.body.data.id,
        long: 20,
        time: 'Minutes',
        alert: '04:00',
        date: today,
    };

    await supertest(app)
        .post('/v1/exercisesplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(data);

    await supertest(app)
        .get('/v1/exercisesplan?date=' + data.date)
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
});

test('PUT /v1/exercisesplan/:id', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    const exercisesData = await supertest(app)
        .post('/v1/exercises/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            name: 'Create Data 30',
            calorie: 130,
            logoExercise:
                'https://res.cloudinary.com/dejongos/image/upload/v1634276426/profilePic/default.png',
        });

    const create = await supertest(app)
        .post('/v1/exercisesplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            exerciseId: exercisesData.body.data.id,
            long: 20,
            time: 'Minutes',
            alert: '05:00',
            date: today,
        });

    const data = {
        long: 30,
        time: 'Minutes',
        alert: '06:00',
        date: today,
    };

    await supertest(app)
        .put('/v1/exercisesplan/' + create.body.data.id)
        .set('Authorization', 'Bearer ' + token.body.token)
        .send(data)
        .expect(200)
        .then((res) => {
            expect(res.body.data.exerciseId).toBe(exercisesData.body.data.id);
            expect(res.body.data.long).toBe(data.long);
            expect(res.body.data.time).toBe(data.time);
            expect(res.body.data.calAmount).toBe(
                Math.round((exercisesData.body.data.calorie / 60) * data.long)
            );
            expect(res.body.data.date).toBe(data.date);
        });
});

test('PUT /v1/exercisesplan/status/:id', async () => {
    const token = await supertest(app).post('/v1/users/signin').send({
        email: 'admin@gmail.com',
        password: 'admindieton',
    });

    const exercisesData = await supertest(app)
        .post('/v1/exercises/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            name: 'Create Data 70',
            calorie: 130,
            logoExercise:
                'https://res.cloudinary.com/dejongos/image/upload/v1634276426/profilePic/default.png',
        });

    const create = await supertest(app)
        .post('/v1/exercisesplan/')
        .set('Authorization', 'Bearer ' + token.body.token)
        .send({
            exerciseId: exercisesData.body.data.id,
            long: 20,
            time: 'Minutes',
            alert: '07:00',
            date: today,
        });

    await supertest(app)
        .put('/v1/exercisesplan/status/' + create.body.data.id)
        .set('Authorization', 'Bearer ' + token.body.token)
        .expect(200)
        .then((res) => {
            expect(res.body.status).toBe('success');
        });
});