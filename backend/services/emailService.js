const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendStatusEmail = async (candidateEmail, candidateName, jobTitle, status, attachmentData = null, extraData = {}) => {
  if (!process.env.EMAIL_USER) {
     console.log(`Mock Email to ${candidateEmail}: Status ${status} for ${jobTitle}`);
     return;
  }

  let subject = "";
  let text = "";
  let attachments = [];

  switch (status) {
    case "Shortlisted":
      subject = `Update on your application for ${jobTitle} at CorpHR`;
      text = `Hi ${candidateName},\n\nWe are pleased to inform you that your resume has been shortlisted for the ${jobTitle} role. We will contact you soon for the next steps.\n\nBest,\nCorpHR Team`;
      break;
    case "Second Round":
      subject = `Invitation to Second Round Interview: ${jobTitle} at CorpHR`;
      text = `Hi ${candidateName},\n\nCongratulations! You have successfully passed the initial rounds. We would like to invite you for a Second Round interview for the ${jobTitle} position. Our team will reach out shortly with scheduling details.\n\nBest,\nCorpHR Team`;
      break;
    case "Rejected":
      subject = `Update on your application for ${jobTitle}`;
      text = `Hi ${candidateName},\n\nThank you for applying for the ${jobTitle} role. Unfortunately, we will not be moving forward with your application at this time.\n\nBest,\nCorpHR Team`;
      break;
    case "Selected":
      subject = `Offer Letter: ${jobTitle} at CorpHR`;
      text = `Hi ${candidateName},\n\nCongratulations! We are thrilled to offer you the position of ${jobTitle}. Please find your offer letter attached.\n\nBest,\nCorpHR Team`;
      if (attachmentData) {
         attachments.push({
           filename: "Offer_Letter.pdf",
           content: attachmentData,
           contentType: "application/pdf"
         });
      }
      break;
    case "Onboarding":
      subject = `Welcome to CorpHR! Your Offer Letter & Login Credentials`;
      text = `Hi ${candidateName},\n\nCongratulations on joining CorpHR as a ${jobTitle}!\n\nPlease find your official Offer Letter attached.\n\nAdditionally, your employee portal account has been created. Here are your login details:\nLogin Email: ${candidateEmail}\nUsername: ${extraData.username}\nTemporary Password: ${extraData.password}\n\nWe are excited to have you on board!\n\nBest,\nCorpHR Team`;
      if (attachmentData) {
         attachments.push({
           filename: "Offer_Letter.pdf",
           content: attachmentData,
           contentType: "application/pdf"
         });
      }
      break;
    default:
      return; // Do nothing for other statuses
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: candidateEmail,
      subject,
      text,
      attachments
    });
    console.log(`Email sent to ${candidateEmail} for status: ${status}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

module.exports = { sendStatusEmail };
