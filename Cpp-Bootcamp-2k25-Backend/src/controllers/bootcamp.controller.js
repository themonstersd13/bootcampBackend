import { Participant } from "../models/participant.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadImageToCloudinary } from "../utils/uploadImage.js";
import nodemailer from "nodemailer";

const registerParticipant = async (req, res) => {
  try {
    const {
      name,
      collegeName,
      yearOfStudy,
      email,
      contactNum,
      laptopAvailable,
      transactionId,
    } = req.body;

    let transactionPhoto = null;
    let collegeIdPhoto = null;

    if (req.files && req.files.transactionPhoto && req.files.idCardPhoto) {
      try {
        transactionPhoto = await uploadImageToCloudinary(
          req.files.transactionPhoto[0].buffer
        );
        console.log(transactionPhoto);
        collegeIdPhoto = await uploadImageToCloudinary(
          req.files.idCardPhoto[0].buffer
        );
        console.log(collegeIdPhoto);
      } catch (err) {
        console.error("Image upload to Cloudinary failed:", err);
      }
    }

    const newParticipant = new Participant({
      name,
      collegeName,
      yearOfStudy,
      email,
      contactNum,
      laptopAvailable,
      transactionId,
      transactionPhoto,
      collegeId: collegeIdPhoto,
    });

    await newParticipant.save();

    res
      .status(201)
      .json(new ApiResponse(201, "New entry added", newParticipant));
  } catch (error) {
    console.error("Error adding new entry:", error);
    res.status(500).json(new ApiError(500, "Error adding new entry", [error]));
  }
};

const contactUs = async (req, res) => {
  const { name, email, message } = req.body;

  console.log("Received Contact Us request:", { name, email, message });

  if (!name || !email || !message) {
    console.error("Validation error: All fields are required");
    return res
      .status(400)
      .json(new ApiError(400, "All fields are required", []));
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ORGANIZATION_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log("Transporter created");

    await transporter.sendMail({
      from: process.env.ORGANIZATION_EMAIL,
      to: email,
      subject: "Thank you for contacting us!",
      text: `Hi ${name},\n\nThank you for reaching out to us. We appreciate your interest and will get back to you shortly.\n\nBest regards,\nYour Organization`,
    });

    console.log(`Thank you email sent to ${email}`);

    await transporter.sendMail({
      from: process.env.ORGANIZATION_EMAIL,
      to: process.env.ORGANIZATION_EMAIL,
      subject: `New Contact Us Message from ${name}`,
      text: `You have received a new message from your website's Contact Us form.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    console.log(`User's message forwarded to organization email`);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Message sent successfully"));
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json(new ApiError(500, "Error sending message", [error]));
  }
};

export default { registerParticipant, contactUs };
