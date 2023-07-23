import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const { DB_HOST, PORT } = process.env;

mongoose
	.connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
		app.listen(PORT, () => {
			console.log(`Server running. Use our API on port: ${PORT}`);
		});
	})
	.catch((error) => {
		console.error(error.message);
		process.exit(1); // stop processes
	});
