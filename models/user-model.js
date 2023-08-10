import { Schema, model } from "mongoose";

import { handleSaveError, validateAtUpdate } from "./hooks.js";
import { emailRegexp } from "../constants/user-constants.js";

const userSchema = new Schema(
	{
		password: {
			type: String,
			minlenth: 6,
			required: [true, "Set password for user"],
		},
		email: {
			type: String,
			match: emailRegexp,
			required: [true, "Email is required"],
			unique: true,
		},
		subscription: {
			type: String,
			enum: ["starter", "pro", "business"],
			default: "starter",
		},
		token: String,
    avatarURL: String,
    verified: {type:Boolean, default: false},
    verificationToken: {
      type: String, required: [true, 'Verification token is required']
    }
	},
	{ versionKey: false, timestamps: true }
);

userSchema.pre("findOneAndUpdate", validateAtUpdate);

userSchema.post("save", handleSaveError);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
