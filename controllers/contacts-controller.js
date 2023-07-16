import contactsService from "../models/contacts.js";

import  HttpError  from "../helpers/HttpError.js";

import ctrlWrapper  from "../decorators/controllerWrapper.js";

/**
 * викликає listContacts() для роботи з файлом contacts.json
 * @param {*} req нічого не отримує
 * @param {*} res повертає масив всіх контактів в json-форматі зі статусом 200
 */
const getAll = async (req, res) => {
	console.log('getAll>>req.param', req.params);
	const result = await contactsService.listContacts();
	res.json(result);
};

/**
 * викликає getContactById() для роботи з файлом contacts.json
 * @param {*} req Отримує параметр id (Не отримує body)
 * @param {*} res  повертає об'єкт контакту в json-форматі зі статусом 200
 *  або помилку з ключем "message": "Not found" і статусом 404
 */
const getById = async (req, res) => {
  const { id } = req.params;
  console.log('getById>>req.param', req.params);
	const result = await contactsService.getContactById(id);
	if (!result) {
		throw HttpError(404, `id=${id}`);
	}
	res.json(result);
};

/**
 * Викликає addContact(body) щоб додати контакт в contacts.json
 * @param {*} req Отримує body ({name, email, phone})-усі поля обов'язкові
 * @param {*} res повертає об'єкт з id {id, name, email, phone} і статусом 201
 */
const add = async (req, res) => {
	console.log('add>>req.body', req.body);

	const result = await contactsService.addContact(req.body);
	res.status(201).json(result);
};

/**
 * Викликає removeContact() для роботи з файлом contacts.json
 * @param {*} req Отримує параметр id (Не отримує body)
 * @param {*} res повертає json {"message": "contact deleted"} і статус 200
 *  або помилку з ключем "message": "Not found" і статусом 404
 */
const deleteById = async (req, res) => {
	console.log('deleteById>>req.params', req.params);

	const { id } = req.params;
	const result = await contactsService.removeContact(id);
	if (!result) {
		throw HttpError(404, `id=${id}`);
	}
	res.json(result);
}

/**
 * Викликає updateContact(contactId, body)
 * @param {*} req Отримує параметр id & body в json-форматі з будь-якою
 *    комбінацією полів name, email и phone
 * @param {*} res повертає оновлений об'єкт контакту, статус 200.
 * або помилку, якщо id немає "message": "Not found" з статусом 404
 */
const updateById = async (req, res) => {
	console.log('updateById>>req.params&body', req.params, req.body);
	const { id } = req.params;
	const result = await contactsService.updateContact(id, req.body);
	if (!result) {
		throw HttpError(404, `id=${id}`);
	}
	res.json(result);
}

export default {
	getAll: ctrlWrapper(getAll),
	getById: ctrlWrapper(getById),
	add: ctrlWrapper(add),
	deleteById: ctrlWrapper(deleteById),
	updateById: ctrlWrapper(updateById),
};

