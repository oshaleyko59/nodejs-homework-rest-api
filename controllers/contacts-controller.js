/**
 * HW4: У функціях обробки запитів заміни код CRUD-операцій над контактами з файлу,
 * на Mongoose-методи для роботи з колекцією контактів в базі даних.
 */

import Contact from "../models/contact-model.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/controllerWrapper.js";

/**
 * викликає Contact.find
 * @param {*} req нічого не отримує
 * @param {*} res повертає масив всіх контактів в json-форматі зі статусом 200
 */
const getAll = async (req, res) => {
	const result = await Contact.find({}, "-createdAt -updatedAt -__v"); // vs find()
	res.json(result);
};

/**
 * викликає Contact.findById
 * @param {*} req Отримує параметр id (Не отримує body)
 * @param {*} res  повертає об'єкт контакту в json-форматі зі статусом 200
 *  або помилку з ключем "message": "Not found" і статусом 404
 */
const getById = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findById(id); // vs findOne({_id: id});
	if (!result) {
		throw HttpError(404, `id=${id}`);
	}
	res.json(result);
};

/**
 * Викликає Contact.create, щоб додати контакт в contacts.json
 * @param {*} req Отримує body ({name, email, phone})-усі поля обов'язкові
 * @param {*} res повертає об'єкт з id {id, name, email, phone} і статусом 201
 */
const add = async (req, res) => {
	const result = await Contact.create(req.body);
	res.status(201).json(result);
};

/**
 * Викликає removeContact() для роботи з файлом contacts.json
 * @param {*} req Отримує параметр id (Не отримує body)
 * @param {*} res повертає json {"message": "contact deleted"} і статус 200
 *  або помилку з ключем "message": "Not found" і статусом 404
 */
const deleteById = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findByIdAndDelete(id); // or findByIdAndRemove
	if (!result) {
		throw HttpError(404, `id=${id}`);
	}
	res.json(result);
}

/**
 * Викликає Contact.findByIdAndUpdate
 * @param {*} req Отримує параметр id & body в json-форматі з будь-якою
 *    комбінацією полів name, email и phone
 * @param {*} res повертає оновлений об'єкт контакту, статус 200.
 * або помилку, якщо id немає "message": "Not found" з статусом 404
 */
const updateById = async (req, res) => {
	const { id } = req.params;
	const result = await Contact.findByIdAndUpdate(id, req.body, {
		new: true,
	//	runValidators: true, //NB! moved to pre hook in contact-model
	});
	if (!result) {
		throw HttpError(404, `id=${id}`);
	}
	res.json(result);
};

/**
 * same as updateById
 */
const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
		throw HttpError(404, `id=${id}`);
	}
	res.json(result);
}

export default {
	getAll: ctrlWrapper(getAll),
	add: ctrlWrapper(add),
	getById: ctrlWrapper(getById),
	updateById: ctrlWrapper(updateById),
	deleteById: ctrlWrapper(deleteById),
	updateFavorite: ctrlWrapper(updateFavorite),
};
