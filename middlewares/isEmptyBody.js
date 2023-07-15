import  HttpError  from "../helpers/HttpError.js";
/**
 * used as middleware for post and put methods
 * Якщо body немає, повертає json з ключем
 * {"message": "missing fields"} і статусом 400
 */
const isEmptyBody = (req, res, next) => {
	const { length } = Object.keys(req.body);
	if (!length) {
		next(HttpError(400, "Missing fields"));
	}
	next();
};

export default isEmptyBody;
