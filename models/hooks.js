export const handleSaveError = (error, data, next) => {
	error.status = 400;
	next(); // just continue with error throw in mongooze
};

export const validateAtUpdate = function (next) {
  this.options.runValidators = true;
  next();
}
