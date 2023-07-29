import { Schema, model } from "mongoose";
import { contactsRegexp } from "../constants/contacts-constants.js";
import { handleSaveError, validateAtUpdate } from "./hooks.js";

const contactSchema = new Schema({
	name: {
		type: String,
		required: [true, "Set name for contact"],
	},
	email: {
		type: String,
	},
	phone: {
		type: String,
		match: [contactsRegexp, "Phone number does not meet the required pattern"],
	},
	favorite: {
		type: Boolean,
		default: false,
	},
  owner: {
      type: Schema.Types.ObjectId,
      ref: 'user', // назва колекції, у якій зберігаються користувачі
  }
}, {versionKey: false, timestamps:true});

// to validate before update
// (instead of settings object for findByIdAndUpdate)
contactSchema.pre("findOneAndUpdate", validateAtUpdate);

// additional action after save to DB operation:
contactSchema.post("save", handleSaveError);
contactSchema.post("findOneAndUpdate", handleSaveError);
contactSchema.post("findOneAndDelete", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
