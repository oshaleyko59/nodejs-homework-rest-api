import Joi from "joi";

import { emailRegexp } from "../constants/user-constants.js";

const userRegisterSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().pattern(emailRegexp).required(),
	password: Joi.string().min(6).required(),
	avatarURL: Joi.string()
});

const userSigninSchema = Joi.object({
	email: Joi.string().pattern(emailRegexp).required(),
	password: Joi.string().min(6).required(),
});

const userSubscriptionSchema = Joi.object({
	subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const userAvatarUrlSchema = Joi.object({
	avatarURL: Joi.string(),
});

export default {
	userRegisterSchema,
	userSigninSchema,
	userSubscriptionSchema,
	userAvatarUrlSchema, // TODO: check the behaivior
};
