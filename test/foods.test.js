const app = require("../server");
const supertest = require("supertest");

test("POST /v1/foods/", async () => {
    const data = {
        
    };
    await supertest(app)
    .post("/v1/foods/") 
    .send(data)
    .expect(200)
    .then((res) => {
        expect(res.body.dataUser.fullName).toBe(data.fullName);
        expect(res.body.dataUser.email).toBe(data.email);
    });
});