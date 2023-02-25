const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.resolve("./db/contacts.json");

async function updatedContacts(contacts) {
  const stringifyContacts = JSON.stringify(contacts);
  await fs.writeFile(contactsPath, stringifyContacts);
}

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const parsData = JSON.parse(data);

    return parsData;
  } catch (error) {
    console.log(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const parsData = await listContacts();
    const findedContact = parsData.find((contact) => contact.id === contactId);

    return findedContact || null;
  } catch (error) {
    console.log(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const parsData = await listContacts();
    const index = parsData.findIndex((contact) => contact.id === contactId);

    if (index === -1) {
      return null;
    }
    const deletedContact = parsData.splice(index, 1);

    updatedContacts(parsData);

    return deletedContact;
  } catch (error) {
    console.log(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const parsData = await listContacts();
    const newContact = { id: uuidv4(), name, email, phone };

    const existName = parsData.find(
      (contact) => contact.name === newContact.name
    );
    if (existName) return;
    parsData.push(newContact);

    updatedContacts(parsData);

    return newContact;
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
