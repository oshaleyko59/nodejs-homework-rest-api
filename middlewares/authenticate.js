import jwt from "jsonwebtoken";

import User from "../models/user-model.js";
import  ctrlWrapper  from "../decorators/controllerWrapper.js";
import  HttpError  from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  // first, check headers for authorization string(default value to cover case of missing)
	const { authorization = "" } = req.headers;
	const [bearer, token] = authorization.split(" ");
	if (bearer !== "Bearer") {
		throw HttpError(401);
	}

  try {
    // second, check token validity
    const { id } = jwt.verify(token, JWT_SECRET);
    // third, check if user is still in the DB and logged in
		const user = await User.findById(id);
		if (!user || !user.token) {
			throw HttpError(401, "Not authorized");
    }
    // fourth, save user in request for further needs
		req.user = user;
		next();
	} catch (error) {
		throw HttpError(401, error.message);
	}
};

export default ctrlWrapper(authenticate);
