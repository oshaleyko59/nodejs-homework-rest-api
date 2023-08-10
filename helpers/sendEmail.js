import nodemailer from "nodemailer";

const { UKRNET_EMAIL, UKRNET_PASSWORD } = process.env;

const nodemailerConfig = {
	host: "smtp.ukr.net",
	port: 465,
	secure: true,
	auth: {
		user: UKRNET_EMAIL,
		pass: UKRNET_PASSWORD,
	},
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
	const email = { ...data, from: UKRNET_EMAIL };
	return transporter.sendMail(email);
};

export default sendEmail;

// test
/* transporter
	.sendMail({
		from: UKRNET_EMAIL,
		to: "oshaleyko@yahoo.com",
		subject: "test nodemailer",
		text: "Тестове повідомлення.",
	})
	.then((info) => console.log("sendMail>>", info))
	.catch((err) => console.log("sendMail>>", err)); */
