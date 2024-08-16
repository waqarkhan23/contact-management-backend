import User from "../models/user.model.js";
import Contact from "../models/contact.model.js";
import { validationResult } from "express-validator";

const Register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    } else {
      try {
        const newUser = await User.create({ name, email, password });
        const newUserObject = newUser.toObject();
        delete newUserObject.password;
        return res.status(200).json(newUserObject);
      } catch (error) {
        return res.status(500).json({ errors: [{ msg: "Server error" }] });
      }
    }
  }
};

const Login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    console.log("Login Api Called");
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.status(400).json({ errors: [{ msg: "Account Not Found" }] });
    }
    const isMatch = await userFound.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    } else {
      const newUserObject = userFound.toObject();
      delete newUserObject.password;
      const token = userFound.getJWTToken();
      return res.status(200).json({ newUserObject, token });
    }
  }
};

const Auth = async (req, res, next) => {
  return res.status(200).json({ success: true, user: req.user });
};

const addContacts = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    const { name, email, number, address } = req.body;
    const createdContact = await Contact.create({
      name,
      email,
      number,
      address,
      user: req.user._id,
    });

    req.user.contacts.push(createdContact._id);
    await req.user.save();
    return res.status(200).json(createdContact);
  }
};

const getContacts = async (req, res) => {
  const id = req.user._id;
  try {
    const contacts = await Contact.find({ user: id });
    res.status(200).json(contacts);
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const getContact = async (req, res) => {
  const contactId = req.params.id;
  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ errors: [{ msg: "Contact not found" }] });
    } else {
      return res.status(200).json(contact);
    }
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const deleteContact = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).json({ errors: [{ msg: "Contact not found" }] });
    } else {
      req.user.contacts = req.user.contacts.filter(
        (contactId) => contactId.toString() !== id
      );
      await req.user.save();
      return res.status(200).json(deletedContact);
    }
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const updateContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    const id = req.params.id;
    const { name, email, number, address } = req.body;
    try {
      const updatedContact = await Contact.findByIdAndUpdate(
        id,
        { name, email, number, address },
        { new: true }
      );
      if (!updatedContact) {
        return res.status(404).json({ errors: [{ msg: "Contact not found" }] });
      } else {
        return res.status(200).json(updatedContact);
      }
    } catch (error) {
      return res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
};

export {
  Register,
  Login,
  Auth,
  addContacts,
  getContacts,
  getContact,
  deleteContact,
  updateContact,
};
