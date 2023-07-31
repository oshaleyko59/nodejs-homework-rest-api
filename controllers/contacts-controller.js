/**
 * HW4: owner field is added and used as filter for
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
	const { _id: owner } = req.user;
	const { page = 1, limit = 20, favorite } = req.query;
	const skip = (page - 1) * limit;
  const filter = { owner };
  if (favorite !== undefined) { filter.favorite = favorite };
	const result = await Contact.find(
		filter,
		"-createdAt -updatedAt -__v",
		{ skip, limit }
	);
	// NB! to enhance owner: 	const result = await Contact.find({owner}, "-createdAt -updatedAt -__v").populate("owner");
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
	const { _id: owner } = req.user;
	const result = await Contact.create({ ...req.body, owner });
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
};

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
		new: true, // =return updated
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
};

export default {
	getAll: ctrlWrapper(getAll),
	add: ctrlWrapper(add),
	getById: ctrlWrapper(getById),
	updateById: ctrlWrapper(updateById),
	deleteById: ctrlWrapper(deleteById),
	updateFavorite: ctrlWrapper(updateFavorite),
};
