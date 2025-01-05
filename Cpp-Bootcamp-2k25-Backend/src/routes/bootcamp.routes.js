import express from "express";
import bootcampController from "../controllers/bootcamp.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const { registerParticipant, contactUs } = bootcampController;

const router = express.Router();

const uploadFields = upload.fields([
  { name: "transactionPhoto", maxCount: 1 },
  { name: "idCardPhoto", maxCount: 1 },
]);

router.post("/register", uploadFields, (req, res) => {
  console.log("POST request received at /bootcamp/register");
  registerParticipant(req, res);
});

router.post("/contact", (req, res) => {
    console.log("POST request received at /bootcamp/contact");
    contactUs(req, res);
});

export default router;
