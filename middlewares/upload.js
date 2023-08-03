import multer from "multer";
import path from "path";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination,
  filename: function (req, file, cb) {
		const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, `${uniquePrefix}-${file.originalname}`);
	},
  },
);
const limits = {
  filesize: 1024 * 1024 * 5
}

const upload = multer({
  storage, limits
});

export default upload;
