const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Multer config for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route for handling form submission
app.post(
  "/register",
  upload.fields([{ name: "photo" }, { name: "attachments" }]),
  async (req, res) => {
    const data = req.body;
    const files = req.files;

    try {
      // Create transporter for Gmail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "hpavilion1202@gmail.com", // Gmail id
          pass: "eyns egnt aqui mndx", //  Gmail App Password
        },
      });

      // Collect attachments
      const attachments = [];
      if (files.photo) {
        attachments.push({
          filename: files.photo[0].originalname,
          content: files.photo[0].buffer,
        });
      }
      if (files.attachments) {
        files.attachments.forEach((file) => {
          attachments.push({
            filename: file.originalname,
            content: file.buffer,
          });
        });
      }

      // Email content
      const mailOptions = {
        from: `"Matrimony Form" <${data.email}>`,
        to: "allgoundersmatrimony@gmail.com", // Where you want to receive the form data
        subject: "New Matrimony Registration",
        html: `
        <p>A message by <strong>${data.fullName}</strong> has been received. Kindly respond at your earliest convenience.</p>
        
        
        <p><strong>${data.fullName}</strong></p>
        <p><strong>Occupation:</strong> ${data.occupation}</p>
        
        <hr />
    
        <p><strong>Full Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone Number:</strong> ${data.phoneNumber}</p>
        <p><strong>Date of Birth:</strong> ${data.dob}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Place:</strong> ${data.place}</p>
        <p><strong>Pincode:</strong> ${data.pincode}</p>
    
        <br />
    
        <p>Thank you for registering!</p>
        <p>Best wishes,<br><strong>All Gounders Matrimony</strong></p>
      `,
        attachments: attachments,
      };

      // Send email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully!" });
    } catch (err) {
      console.error("Error sending email:", err);
      res.status(500).json({ message: "Failed to send email" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
