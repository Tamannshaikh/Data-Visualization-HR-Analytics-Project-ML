const PDFDocument = require("pdfkit");

const generateOfferLetter = async (candidateName, jobRole, salaryRange) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        let pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // PDF Content
      // PDF Content
      doc.fontSize(25).fillColor("#2563EB").text("CorpHR Solutions - Official Letter of Employment", { align: 'center' });
      doc.moveDown(1.5);
      doc.fontSize(12).fillColor("#000000").text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });
      doc.moveDown();
      doc.fontSize(14).text(`Dear ${candidateName},`);
      doc.moveDown();
      doc.text(`We are pleased to formally offer you the position of ${jobRole} at CorpHR Solutions. We believe your skills and experience are an excellent match for our company's mission and team.`);
      doc.moveDown();
      doc.text(`Your starting compensation package is approved at a rate of ${salaryRange || 'industry standard'}, subject to standard deductions and taxes.`);
      doc.moveDown();
      doc.text(`Please review this offer and confirm your acceptance. We look forward to welcoming you aboard!`);
      doc.moveDown(2);
      doc.text("Sincerely,");
      doc.moveDown();
      doc.text("Human Resources Department\nCorpHR Solutions", { font: "Helvetica-Bold" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateOfferLetter };
