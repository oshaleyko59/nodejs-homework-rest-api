/**
 * express.Router class used to create  a modular routing system for
 * contacts endpoint using functions from contacts-controller module
 * (NB! can also include middleware)
 */
import { Router } from "express";

import contactsController from "../../controllers/contacts-controller.js";
import validateBody from "../../decorators/validateBody.js";
import contactsSchemas from "../../schemas/contacts-schemas.js";
import isEmptyBody from "../../middlewares/isEmptyBody.js";

const router = Router();

router.get("/", contactsController.getAll);

router.get("/:contactId", contactsController.getById);

/**
 *  validation of body presence of required fields
 *   if fails, error {"message": "missing required name field"} &status 400
 */
router.post("/", validateBody(contactsSchemas.contactsAddSchema), contactsController.add);

router.delete("/:contactId", contactsController.deleteById);

/**
 *  validation of body not empty and format of fields //TODO: check for unsupported fields ?
 *   if fails, error {"message": "missing required name field"} &status 400
 */
router.put(
	"/:contactId",
	isEmptyBody,
	validateBody(contactsSchemas.contactsUpdateSchema),
	contactsController.updateById
);

export default router;

/* NB! router.METHOD(path, [callback, ...] callback)
 You can provide multiple callbacks, and all are treated equally,
and behave just like middleware, except that these callbacks may invoke
next('route') to bypass the remaining route callback(s). You can use this
mechanism to perform pre-conditions on a route then pass control to subsequent
routes when there is no reason to proceed with the route matched. */
