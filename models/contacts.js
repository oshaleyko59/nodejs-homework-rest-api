import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const contactsPath = path.resolve("models", "contacts.json");

const saveContacts = (contacts) =>
	fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));


const listContacts = async () => {
  const data = await fs.readFile(contactsPath);

  const result = JSON.parse(data);
  return result;
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contactId === contact.id);
  return result || null;
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const ind = contacts.findIndex((contact) => contactId === contact.id);
  if (ind === -1) {
    return null;
  }
  const [result] = contacts.splice(ind, 1);
  await saveContacts(contacts);
  return result; // deleted contact
}

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = { ...body, id: nanoid() };
  contacts.push(newContact);
  await saveContacts(contacts);
  return newContact;
}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
	const ind = contacts.findIndex((contact) => contactId === contact.id);
	if (ind === -1) {
		return null;
  }
  const updatedContact = { ...contacts[ind], ...body };
  contacts[ind] = updatedContact;
  await saveContacts(contacts);
  return updatedContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
