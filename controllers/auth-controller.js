import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user-model.js";
import  ctrlWrapper  from "../decorators/controllerWrapper.js";
import  HttpError  from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, "Conflict");
	}

	const hashPassword = await bcrypt.hash(password, 10);
	const newUser = await User.create({ ...req.body, password: hashPassword });

  res
		.status(201)
		.json(
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

export default {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	getCurrent: ctrlWrapper(getCurrent),
	logout: ctrlWrapper(logout),
};
