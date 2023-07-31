import mongoose from "mongoose";
import "dotenv/config";
import app from "./app.js";
 // same as above: import dotenv from "dotenv"; dotenv.config();

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
		console.error(`Connection to db-contacts failed: ${error.message}`);
		process.exit(1); // stop processes
	});
