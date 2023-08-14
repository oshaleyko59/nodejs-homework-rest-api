import Joi from "joi";

import { emailRegexp } from "../constants/user-constants.js";

const userRegisterSchema = Joi.object({
	email: Joi.string().pattern(emailRegexp).required(),
	password: Joi.string().min(6).required(),
	avatarURL: Joi.string(),
});

const userSigninSchema = Joi.object({
	email: Joi.string().pattern(emailRegexp).required(),
	password: Joi.string().min(6).required(),
});

const userSubscriptionSchema = Joi.object({
	subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const userEmailSchema = Joi.object({
	email: Joi.string().pattern(emailRegexp).required(),
});

export default {
	userRegisterSchema,
	userSigninSchema,
	userSubscriptionSchema,
	userEmailSchema,
};
