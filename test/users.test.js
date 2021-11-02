const app = require("../server");
const supertest = require("supertest");

test("POST /v1/users/register", async () => {
    const data = {
        fullName: "Testing Test",
        email: "testingtest2@gmail.com",
        password: "testingtest2",
        calorieSize: 1500,
        weight: 86,
        height: 175,
        waistline: 44,
        thigh: 50
    };
    await supertest(app)
    .post("/v1/users/register") 
    .send(data)
    .expect(200)
    .then((res) => {
        expect(res.body.dataUser.fullName).toBe(data.fullName);
        expect(res.body.dataUser.email).toBe(data.email);
        expect(res.body.dataUser.password).toBe(res.body.dataUser.password);
        expect(res.body.dataUser.calorieSize).toBe(data.calorieSize);
        expect(res.body.dataUser.height).toBe(data.height);
        expect(res.body.dataUser.earlyWeight).toBe(data.weight);
        expect(res.body.dataUser.progress).toBe(0);
        expect(res.body.dataUser.BMI).toBe(Math.round(data.weight / ((data.height / 100) ** 2)))
        expect(res.body.dataCalorie.calConsumed).toBe(0);
        expect(res.body.dataCalorie.remainCalSize).toBe(data.calorieSize);
        expect(res.body.dataWeight.weight).toBe(data.weight);
        expect(res.body.dataWeight.waistline).toBe(data.waistline);
        expect(res.body.dataWeight.thigh).toBe(data.thigh)
    });
});


test("POST /v1/users/signin", async () => {
    const token = {
        email: "admin@gmail.com",
        password: "admindieton"
    };
    await supertest(app)
    .post("/v1/users/signin") 
    .send(token)
    .expect(200)
    .then((res) => {
        expect(res.body.status).toBe('success');
    });
});

test("DELETE /v1/users/delete/:id", async () => {
    const data = {
                fullName: "Fariz",
                email: "testbaru23@gmail.com",
                password: "testbaru23",
                calorieSize: 1500,
                weight: 86,
                height: 175,
                waistline: 44,
                thigh: 50
    }

    const user = await supertest(app)
    .post("/v1/users/register")
    .send(data)

    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "testbaru23@gmail.com",
        password: "testbaru23"
    })

    await supertest(app)
    .delete("/v1/users/delete/" + user.body.dataUser.id)
    .set("Authorization", "Bearer " + token.body.token)
    .expect(200)
    .then((res) => {
        expect(res.body.status).toBe('success');
    });
});

test("PUT /v1/users/update", async () => {
    const data = {
                fullName: "Fariz",
                email: "testbaru26@gmail.com",
                password: "testbaru26",
                calorieSize: 1500,
                weight: 86,
                height: 175,
                waistline: 44,
                thigh: 50
    }

    await supertest(app)
    .post("/v1/users/register")
    .send(data)

    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "testbaru26@gmail.com",
        password: "testbaru26"
    })

    const updateData = {
        fullName : "test update"
    }

    await supertest(app)
    .put("/v1/users/update")
    .set("Authorization", "Bearer " + token.body.token)
    .send(updateData)
    .expect(200)
    .then((res) => {
        expect(typeof res.body).toBe('object');
    });
});

test("GET /v1/users/userprofile", async () => {
    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "admin@gmail.com",
        password: "admindieton"
    })

    await supertest(app)
    .get("/v1/users/userprofile")
    .set("Authorization", "Bearer " + token.body.token)
    .expect(200)
    .then((res) => {
        expect(typeof res.body).toBe('object');
    });
});

test("GET /v1/users/", async () => {
    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "admin@gmail.com",
        password: "admindieton"
    })

    await supertest(app)
    .get("/v1/users/")
    .set("Authorization", "Bearer " + token.body.token)
    .expect(200)
    .then((res) => {
        expect(Array.isArray(res.body.data)).toBeTruthy();
    });
});

test("PUT /v1/users/verifiedaccount/:id", async () => {
    const data = {
        fullName: "Fariz",
        email: "testbaru2021@gmail.com",
        password: "testbaru2021",
        calorieSize: 1500,
        weight: 86,
        height: 175,
        waistline: 44,
        thigh: 50
    }

    const user = await supertest(app)
    .post("/v1/users/register")
    .send(data)

    const updateData = {
        isVerified : true
    } 

    await supertest(app)
    .put("/v1/users/verifiedaccount/" + user.body.dataUser.id)
    .send(updateData)
    .expect(200)
    .then((res) => {
        expect(res.body.status).toBe('success');
    });
});

test("PUT /v1/users/resetpassword", async () => {
    const data = {
        fullName: "Fariz",
        email: "testbaru53@gmail.com",
        password: "testbaru53",
        calorieSize: 1500,
        weight: 86,
        height: 175,
        waistline: 44,
        thigh: 50
    }

    const user = await supertest(app)
    .post("/v1/users/register")
    .send(data)

    const updateData = {
        email : "testbaru53@gmail.com"
    } 

    await supertest(app)
    .put("/v1/users/resetpassword")
    .send(updateData)
    .expect(200)
    .then((res) => {
        expect(res.body.status).toBe('success');
    });
});

