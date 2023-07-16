/**
 * Validation of body for add contact and update contacts handlers
 */

import Joi from "joi";

const schemaPhoneNumber = Joi.string().pattern(
  /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
).message("phone number does not meet the required pattern");

/**
 * body must be an object {name, email, phone}.
 * All fields required
 * {"message": "missing required name field"} і статусом 400
 */
const contactsAddSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	phone: schemaPhoneNumber.required(),
});


/**
 * body must be an object with at least one of the keys:
 *      "name", "email", "phone"
 * Якщо body немає, повертає json {"message": "missing fields"} і статусом 400
 */
const contactsUpdateSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string().email(),
	phone: schemaPhoneNumber,
});

export default {
	contactsAddSchema,
	contactsUpdateSchema,
};
