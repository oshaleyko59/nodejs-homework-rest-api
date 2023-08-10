import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import { nanoid } from "nanoid";

import User from "../models/user-model.js";
import ctrlWrapper from "../decorators/controllerWrapper.js";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";
import createVerifyEmail from "../helpers/createVerifyEmail.js";

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, "Email in use"); // Conflict
	}

	const avatarURL = gravatar.url(email, {
		s: "200", // size
		r: "pg", // allowed rating ()
		d: "robohash", // "404", // default avatar (url-encoded, publicly available, or 404 -do not load any image)
	});

	const verificationToken = nanoid();
	const hashPassword = await bcrypt.hash(password, 10);
	const newUser = await User.create({
		...req.body,
		password: hashPassword,
		avatarURL,
		verificationToken,
  });

	/* відправити email на пошту користувача і вказати посилання для
  верифікації email'а  ( /users/verify/:verificationToken) в повідомленні */
  // TODO:
  const verifyEmail = createVerifyEmail({ email, verificationToken });
  await sendEmail(verifyEmail);

	res.status(201).json(
		/* "Успішна відповідь" */
		{
			user: {
				email: newUser.email,
				subscription: "starter",
			},
		}
	);
};


const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  // check if user exists
	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(404, "Email not found");
  }

	// check if already verified
  if (user.verified) {
    throw HttpError(400, "Verification has already passed");
  }

	// create verify email
	const verifyEmail = createVerifyEmail({
		email,
		verificationToken: user.verificationToken,
  });
  await sendEmail(verifyEmail);
  
  res.json({
		message: "Verification email sent",
	});
};

const verify = async (req, res) => {
	const { verificationToken } = req.params;
	const user = await User.findOne({ verificationToken });
	if (!user) {
		throw HttpError(404, "Email not found");
	}

	await User.findByIdAndUpdate(user._id, {
		verified: true,
		verificationToken: null,
  });

	res.json({
		message: "Verification successful",
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(401, "Email or password invalid");
	}

  // login not allowed if user 's email not verified
	if (!user.verified) {
		throw HttpError(401, "Email not verified");
	}

	const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) {
		throw HttpError(401, "Email or password is wrong");
	}

	const payload = {
		id: user._id,
	};

	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
	await User.findByIdAndUpdate(user._id, { token });

	res.json({
		token,
		user: {
			email,
			subscription: user.subscription,
		},
	});
};

const getCurrent = (req, res) => {
	const { subscription, email } = req.user;

	res.json({
		// name,
		email,
		subscription,
	});
};

const logout = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: "" });

	res.status(204).json({
		message: "Logout success",
	});
};

/**
 * update subscription
 */
const updateSubscription = async (req, res) => {
	const { _id } = req.user;
	const result = await User.findByIdAndUpdate(_id, req.body, { new: true });

	res.json({
		subscription: result.subscription,
	});
};

const avatarsPath = path.resolve("public", "avatars");

/**
 * update avatar
 */
const updateAvatar = async (req, res) => {
	const { _id } = req.user;
	const { path: currentPath, filename } = req.file;
	const newFilename = `ava-${_id}${filename.split(".")[1]}`;
	const newPath = path.join(avatarsPath, newFilename);
	fs.rename(currentPath, newPath);

	const image = await Jimp.read(newPath);
	image.resize(250, 250).write(newFilename);
	const avatarURL = path.join("avatars", newFilename);
	const result = await User.findByIdAndUpdate(
		_id,
		{ avatarURL },
		{ new: true }
	);

	res.json({
		avatarURL: result.avatarURL,
	});
};

export default {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	getCurrent: ctrlWrapper(getCurrent),
	logout: ctrlWrapper(logout),
	updateSubscription: ctrlWrapper(updateSubscription),
	updateAvatar: ctrlWrapper(updateAvatar),
	resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
	verify: ctrlWrapper(verify),
};
