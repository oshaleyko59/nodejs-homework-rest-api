const controllerWrapper = (controller) => {
	return async (req, res, next) => {
		try {
			await controller(req, res, next);
    } catch (error) {
     // console.debug("error>>authenticate");
			next(error);
		}
	};
};

export default controllerWrapper;
