import mongoose from "mongoose";
import request from "supertest";
import "dotenv/config";
import jwt from "jsonwebtoken";

import app from "../../app.js";
import User from "../../models/user-model.js";

const { PORT, DB_HOST_TEST, JWT_SECRET } = process.env;

/* Написати unit-тести для контролера входу (логін)
За допомогою Jest

відповідь повина мати статус-код 200
у відповіді повинен повертатися токен
у відповіді повинен повертатися об'єкт user з 2 полями:
 email и subscription з типом даних String
 */

describe("login controller test", () => {
	let server;
	const userData = { email: "osha@gmail.com", password: "123456" };

	//launch controller
	beforeAll(async () => {
		try {
			await mongoose.connect(DB_HOST_TEST);
			server = app.listen(PORT, () => {
				console.log(`Server running on port ${PORT}>>`, !!server);
			});
		} catch (e) {
			console.log("CONNECTION FAILED! ", e);
			process.exit(1); // stop processes
		}
	});

	afterAll(async () => {
		await mongoose.connection.close();
    server.close();
	});

	beforeEach(async () => {
		await request(app)
			.post("/api/users/register")
			.send(userData);
		const user = await User.findOne({ email: userData.email });
		if (user.email !== userData.email) {
      throw new Error("TEST DB failure!");
		}
	});

	afterEach(async () => {
		await User.deleteMany();
	});

	test("Success response code = 200, must contain token and user object with email and subscription", async () => {
		const { statusCode, body } = await request(app)
			.post("/api/users/login")
			.send(userData);
		expect(statusCode).toBe(200);
		expect(body.user.email).toBe(userData.email);
		expect(body.user.subscription).toBe("starter");

    expect(!!body.token).toBe(true);

		//check token validity
    const { id } = jwt.verify(body.token, JWT_SECRET);
    const user = await User.findOne({ _id:id });
    expect(user.email === userData.email).toBe(true);
	});
});
