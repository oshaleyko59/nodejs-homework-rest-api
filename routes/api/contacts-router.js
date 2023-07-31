/**
  HW5: authenticate added
 */

/**
 * express.Router class used to create  a modular routing system for
 * contacts endpoint using functions from contacts-controller module
 * (NB! can also include middleware)
 */
import { Router } from "express";

import contactsController from "../../controllers/contacts-controller.js";
import contactsSchemas from "../../schemas/contacts-schemas.js";
import validateBody from "../../decorators/validateBody.js";
import isEmptyBody from "../../middlewares/isEmptyBody.js";
import isValidId from "../../middlewares/isValidId.js";
import authenticate from "../../middlewares/authenticate.js";

const router = Router();
router.use(authenticate);

router.get("/", contactsController.getAll);

router.get("/:id", isValidId, contactsController.getById);

/**
 *  validation of fields presence and format in body
 *  and also phone pattern
 *   if fails, error {"message": "missing required name field"} &status 400
 */
router.post(
	"/",
	validateBody(contactsSchemas.contactsAddSchema),
	contactsController.add
);
router.delete("/:id", contactsController.deleteById);

/**
 *  validation of body (not empty) and format of fields
 *   if fails, error {"message": "missing required name field"} &status 400
 */
router.put(
	"/:id",
	isEmptyBody,
	isValidId,
	validateBody(contactsSchemas.contactsUpdateSchema),
	contactsController.updateById
);

router.patch(
	"/:id/favorite",
	isValidId,
	validateBody(contactsSchemas.contactUpdateFavoriteSchema),
	contactsController.updateFavorite
);

export default router;

/* NB! router.METHOD(path, [callback, ...] callback)
  You can provide multiple callbacks, and all are treated equally,
and behave just like middleware, except that these callbacks may invoke
next('route') to bypass the remaining route callback(s). You can use this
mechanism to perform pre-conditions on a route then pass control to subsequent
routes when there is no reason to proceed with the route matched. */
