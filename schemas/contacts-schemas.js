/**
 * Validation of body for add contact and update contacts handlers
 */

import Joi from "joi";
/*
// TODO: test more complex variants
const schemaEmail = Joi.string().email().trim();
const schemaPhoneNumber = Joi.string().trim().pattern(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/);
const schemaName = Joi.string().trim(); // TODO: parse and join
 */
/**
 * body must be an object {name, email, phone}.
 * All fields required
 * {"message": "missing required name field"} і статусом 400
 */
const contactsAddSchema = Joi.object({
	name: Joi.string().required().messages({
		"any.required": "missing required field",
	}),
	email: Joi.string().required(),
	phone: Joi.string().required(),
});
/* const contactsAddSchema = Joi.object({
	name: schemaName.required().messages({
		"any.required": "missing required field",
	}),
	email: schemaEmail.required(),
	phone: schemaPhoneNumber.required(),
});
 */


/**
 * body must be an object with at least one of the keys:
 *      "name", "email", "phone"
 * Якщо body немає, повертає json {"message": "missing fields"} і статусом 400
 */
const contactsUpdateSchema = Joi.object({
	name: Joi.string(),
	email: Joi.string(),
	phone: Joi.string(),
});

/* const contactsUpdateSchema = Joi.object({
	name: schemaName,
	email: schemaEmail,
	phone: schemaPhoneNumber,
})
	.empty()
	.error("missing fields");
 */

export default {
	contactsAddSchema,
	contactsUpdateSchema,
};
