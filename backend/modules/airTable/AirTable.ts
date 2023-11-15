import Airtable, { FieldSet } from 'airtable';

export class AirtableService {
    private base: Airtable.Base;
    private readonly apiKey = ''; //Вставьте ключ из сообщения
  private readonly baseId = 'appJTu6nbx4psjia5';
  private readonly tableName = 'Users'; 

  constructor() {
    this.base = new Airtable({ apiKey: this.apiKey }).base(this.baseId);
  }

  async searchInAirtable(query: string): Promise<string | null> {
    try {
      const records = await this.base(this.tableName)
        .select({
          filterByFormula: `{email} = '${query}'`, 
        })
        .firstPage();
  
      if (records.length > 0) {
        return records[0].id; 
      } else {
        return null; 
      }
    } catch (error) {
      throw new Error('Error searching in Airtable'); 
    }
  }
  

  async updateAirtableRecord(recordId: string, strapiId: string): Promise<void> {
    try {
      await this.base('Users').update(recordId, {strapi_id: strapiId});
    } catch (error) {
      throw new Error('Error updating record in Airtable');
    }
  }
  
}



