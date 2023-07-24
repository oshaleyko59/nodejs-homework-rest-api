/**
 * middleware to fix error 500 when id parameter is
 * not validated successfully by Mongooze
 */
import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";

const isValidId = (req, res, next) => {
	const { id } = req.params;
	if (!isValidObjectId(id)) {
		return next(HttpError(404, `${id} is not valid id`));
	}
	next();
};

export default isValidId;
