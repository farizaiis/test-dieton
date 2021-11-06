const app = require("../server");
const supertest = require("supertest");

// test("POST /v1/foods/", async () => {
//     const data = {
//         name : "King Banana",
//         calorie : 120,
//         unit : "Slice"
//     };

//     const token = await supertest(app)
//     .post("/v1/users/signin")
//     .send({
//         email: "admin@gmail.com",
//         password: "admindieton"
//     })
    
//     const akg = 2000

//     await supertest(app)
//     .post("/v1/foods/")
//     .set("Authorization", "Bearer " + token.body.token)
//     .send(data)
//     .expect(200)
//     .then((res) => {
//         expect(res.body.data.name).toBe(data.name);
//         expect(res.body.data.calorie).toBe(data.calorie);
//         expect(res.body.data.rda).toBe(Math.round((data.calorie / akg) * 100));
//         expect(res.body.data.unit).toBe(data.unit);
//     });
// });

test("GET /v1/foods/", async () => {

    const token = await supertest(app)
    .post("/v1/users/signin")
    .send({
        email: "admin@gmail.com",
        password: "admindieton"
    })

    await supertest(app)
    .get("/v1/foods/")
    .set("Authorization", "Bearer " + token.body.token)
    .expect(200)
    .then((res) => {
        expect(Array.isArray(res.body.data)).toBeTruthy();
    });
});

// test("GET /v1/foods/:id", async () => {

//     const token = await supertest(app)
//     .post("/v1/users/signin")
//     .send({
//         email: "admin@gmail.com",
//         password: "admindieton"
//     })

//     const id = 3

//     await supertest(app)
//     .get("/v1/foods/" + id)
//     .set("Authorization", "Bearer " + token.body.token)
//     .expect(200)
//     .then((res) => {
//         expect(typeof res.body).toBe('object');
//     });
// });

// test("GET /v1/foods?name=", async () => {

//     const token = await supertest(app)
//     .post("/v1/users/signin")
//     .send({
//         email: "admin@gmail.com",
//         password: "admindieton"
//     })

//     const name = "r"

//     await supertest(app)
//     .get("/v1/foods?name=" + name)
//     .set("Authorization", "Bearer " + token.body.token)
//     .expect(200)
//     .then((res) => {
//         expect(Array.isArray(res.body.data)).toBeTruthy();
//     });
// });

// test("PUT /v1/foods/:id", async () => {

//     const token = await supertest(app)
//     .post("/v1/users/signin")
//     .send({
//         email: "admin@gmail.com",
//         password: "admindieton"
//     })

//     const data = {
//         name : "Update 3",
//         calorie : 130,
//         unit : "Slice"
//     }

//     const createData = await supertest(app)
//     .post("/v1/foods/")
//     .set("Authorization", "Bearer " + token.body.token)
//     .send(data)

//     const updateData = {
//         name : "Update 4",
//         calorie : 130,
//         unit : "Slice"
//     }

//     const akg = 2000

//     await supertest(app)
//     .put("/v1/foods/" + createData.body.data.id)
//     .set("Authorization", "Bearer " + token.body.token)
//     .send(updateData)
//     .expect(200)
//     .then((res) => {
//         expect(res.body.data.name).toBe(updateData.name);
//         expect(res.body.data.calorie).toBe(updateData.calorie);
//         expect(res.body.data.rda).toBe(Math.round((updateData.calorie / akg) * 100));
//         expect(res.body.data.unit).toBe(updateData.unit);
//     });
// });

// test("DELETE /v1/foods/:id", async () => {

//     const token = await supertest(app)
//     .post("/v1/users/signin")
//     .send({
//         email: "admin@gmail.com",
//         password: "admindieton"
//     })

//     const data = {
//         name : "Delete 1",
//         calorie : 130,
//         unit : "Slice"
//     }

//     const createData = await supertest(app)
//     .post("/v1/foods/")
//     .set("Authorization", "Bearer " + token.body.token)
//     .send(data)

//     await supertest(app)
//     .delete("/v1/foods/" + createData.body.data.id)
//     .set("Authorization", "Bearer " + token.body.token)
//     .expect(200)
//     .then((res) => {
//         expect(res.body.status).toBe('success');
//     });
// });