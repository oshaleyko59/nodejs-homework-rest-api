import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from 'gravatar';
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp/es";

import User from "../models/user-model.js";
import  ctrlWrapper  from "../decorators/controllerWrapper.js";
import  HttpError  from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, "Email in use"); // Conflict
	}
	// TODO: what are the options?
	const avatarURL = gravatar.url(email, {
		s: "200",
		r: "pg",
		d: "404",
  });

	// for "emerleite@gmail.com" returns //www.gravatar.com/avatar/93e9084aa289b7f1f5e4ab6716a56c3b?s=200&r=pg&d=
	console.debug("avatarURL>>", avatarURL);

	const hashPassword = await bcrypt.hash(password, 10);
	const newUser = await User.create({
		...req.body,
		password: hashPassword,
		avatarURL,
	});

	res.status(201).json(
		/* "Успішна відповідь" */
		{
			user: {
				// name: newUser.name,
				email: newUser.email,
				subscription: "starter",
			},
		}
	);
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(401, "Email or password invalid");
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
    subscription
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

	res.json(result);
};

const avatarsPath = path.resolve('public', 'avatars');

/**
 * update avatar
 */ // FIXME: test
const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: currentPath, filename } = req.file;
  const newFilename = `ava-${_id}${filename.split('.')[1]}`;
  const newPath = path.join(avatarsPath, newFilename);
  fs.rename(currentPath, newPath);

 // console.debug(req.file);
  const image = await Jimp.read(newPath);
  image.resize(250, 250).write(newFilename);
  const avatarUrl = path.join( "avatars", newFilename);
	const result = await User.findByIdAndUpdate(_id, {avatarUrl}, { new: true });

	res.json(result);
};

export default {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	getCurrent: ctrlWrapper(getCurrent),
	logout: ctrlWrapper(logout),
	updateSubscription: ctrlWrapper(updateSubscription),
	updateAvatar: ctrlWrapper(updateAvatar)
};
