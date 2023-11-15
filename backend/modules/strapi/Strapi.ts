import axios from 'axios';

export class StrapiService {
  private readonly baseUrl: string;
  private readonly authToken: string;

  constructor() {
      this.baseUrl = 'http://127.0.0.1:1337/api/ids-in-airtables';
      this.authToken = '';
    }
    

    async findUser(email: string): Promise<void> {
      try {
        const url = `${this.baseUrl}?filters[email][$eq]=${email}`;
        const config = {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        };
    
        const response = await axios.get(url, config);
    
        if (response.data && response.data.length > 0 && response.data[0]?.attributes?.email === email) {
          throw new Error('User with this email already exists');
        }
      } catch (error) {
        throw new Error('Error checking user in Strapi');
      }
    }
    
    
    
    async createUser(email: string, airtableId: string): Promise<any> {
      try {
        await this.findUser(email); // Check if the user already exists
  
        const url = `${this.baseUrl}`;
        const userData = {
          data: {
            email: email,
            airtable_id: airtableId,
          },
        };
  
        const config = {
          headers: {
            Authorization: `Bearer ${this.authToken}`, 
          },
        };
  
        const response = await axios.post(url, userData, config);
        const itemId = response.data.data.id;
        return itemId;
      } catch (error) {
        throw new Error('Error creating user in Strapi');
      }
    }
    


}

