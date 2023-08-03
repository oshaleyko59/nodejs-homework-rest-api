import express from "express";

import authController from "../../controllers/auth-controller.js";
import validateBody from "../../decorators/validateBody.js";
import usersSchemas from "../../schemas/users-schemas.js";
import authenticate from "../../middlewares/authenticate.js";
import upload from "../../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post(
	"/register",
	validateBody(usersSchemas.userRegisterSchema),
	authController.register
);

authRouter.post(
	"/login",
	validateBody(usersSchemas.userSigninSchema),
	authController.login
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch(
	"/",
	authenticate,
	validateBody(usersSchemas.userSubscriptionSchema),
	authController.updateSubscription
);

/* Додай можливість поновлення аватарки, створивши
 ендпоінт /users/avatars і використовуючи метод PATCH. */
authRouter.patch(
	"/avatars", upload.single("avatar"),
	authenticate,
 // FIXME:	validateBody(usersSchemas.userAvatarSchema),
	authController.updateAvatar
);

export default authRouter;
