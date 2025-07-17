/**
 * Contact Controller
 * Handles contact form business logic
 */
const { queryDatabase } = require('../db/db');

/**
 * Send a contact message
 * @route POST /api/contact/send
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10); // yyyy-mm-dd
    const formattedTime = currentDate.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const { firstName, lastName, email, cellphoneNumber, subject, message } = req.body;
    const insertContactUsQuery = 'INSERT INTO contactus (firstName, lastName, email, cellphoneNumber, subject, message, dateOfMessage, timeOfmessage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    await queryDatabase(insertContactUsQuery, [firstName, lastName, email, cellphoneNumber, subject, message, formattedDate, formattedTime]);
    res.json({ success: true, message: 'Message sent and saved successfully!' });
  } catch (error) {
    console.error('Error handling form submission:', error);
    next(error);
  }
}; 