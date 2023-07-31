export const handleSaveError = (error, data, next) => {
  const { code, name } = error;
  // conflict error for "email is already egistered" case
	error.status = code === 11000 && name === "MongoServerError" ? 409 : 400;
};

export const validateAtUpdate = function (next) {
	this.options.runValidators = true;
	next();
};
