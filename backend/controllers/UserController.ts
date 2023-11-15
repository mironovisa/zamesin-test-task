import { Request, Response } from 'express';
import { AirtableService } from '../modules/airTable/AirTable';
import { StrapiService } from '../modules/strapi/Strapi';
import sendMockEmail  from '../utils/nodemailer';
import generateRandomPassword from '../utils/generateRandomPassword';
const airtableService = new AirtableService();
const strapiService = new StrapiService();

const UserController = {
  async checkEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email.');
      }

      const airTableId = await airtableService.searchInAirtable(email);

      if (airTableId) {
        const strapiId = await strapiService.createUser(email, airTableId);
        const strapiIdString = strapiId.toString();
        await airtableService.updateAirtableRecord(airTableId, strapiIdString);
        const generatedPassword = generateRandomPassword();
        const emailSent = await sendMockEmail(email, generatedPassword);
        if (!emailSent) {
          throw new Error('Failed to send the email.');
        }
        res.status(200).json({ airTableId, strapiId, generatedPassword, emailSent });
      } else {
        res.status(404).json({ message: 'No record found for the given email.' });
      }
    } catch (error: any) {
      const errorCode = error.statusCode || 500;
      res.status(errorCode).json({ error: error.message });
    }
  },
};

export default UserController;
