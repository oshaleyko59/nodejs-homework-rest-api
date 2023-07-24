/**
 * Validation of body for add contact and update contacts handlers
 */

import Joi from "joi";
import { contactsRegexp } from "../constants/contacts-constants.js";

const schemaPhoneNumber = Joi.string().pattern(contactsRegexp).message("phone number does not meet the required pattern");

/**
 * body must be an object {name, email, phone}.
 * All fields required
 * {"message": "missing required name field"} і статусом 400
 */
const contactsAddSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
  phone: schemaPhoneNumber.required(),
  favorite: Joi.boolean(),
});


/**
 * body must be an object with at least one of the keys:
 *      "name", "email", "phone", "favorite"
 */
const contactsUpdateSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string().email(),
	phone: schemaPhoneNumber,
	favorite: Joi.boolean(),
});

/**
 * for updating favorite field
 */
const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export default {
	contactsAddSchema,
	contactsUpdateSchema,
	contactUpdateFavoriteSchema,
};
