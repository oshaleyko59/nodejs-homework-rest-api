const messageList = { // TODO: , maybe other codes?
	400: "Bad Request",
	401: "Unauthorized",
	403: "Forbidden",
	404: "Not Found",
	409: "Conflict",
};

const HttpError = (status, message) => {
  const msg = messageList[status].concat(message && (": " + message));
	const error = new Error(msg);
	error.status = status;
	return error;
};

export default HttpError;
