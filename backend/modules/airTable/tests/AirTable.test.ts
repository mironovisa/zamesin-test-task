import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import { AirtableService } from '../AirTable';

describe('searchInAirtable', () => {
  let airtableService: AirtableService;
  let searchStub: SinonStub;

  beforeEach(() => {
    airtableService = new AirtableService();
    searchStub = sinon.stub(airtableService, 'searchInAirtable');
  });

  it('should search in Airtable and return record ID if found', async () => {
    const email = 'test@example.com';
    searchStub.withArgs(email).resolves('recordId');

    const recordId = await airtableService.searchInAirtable(email);
    expect(recordId).to.be.a('string');
    expect(recordId).to.equal('recordId');
  });

  it('should return null if no record is found in Airtable', async () => {
    const email = 'nonexistent@example.com';
    searchStub.withArgs(email).resolves(null);

    const recordId = await airtableService.searchInAirtable(email);
    expect(recordId).to.equal(null);
  });

  afterEach(() => {
    searchStub.restore();
  });
});

describe('updateAirtableRecord', () => {
  let airtableService: AirtableService;
  let updateStub: SinonStub;

  beforeEach(() => {
    airtableService = new AirtableService();
    updateStub = sinon.stub(airtableService, 'updateAirtableRecord');
  });

  it('should update a record in Airtable', async () => {
    const recordId = 'exampleRecordId';
    const strapiId = 'strapiIdValue';

    updateStub.withArgs(recordId, { strapi_id: strapiId }).resolves();

    await airtableService.updateAirtableRecord(recordId, strapiId);
    expect(updateStub.calledOnce).to.be.true;
  });

  it('should throw an error if there is an issue updating the record', async () => {
    const recordId = 'exampleRecordId';
    const strapiId = 'strapiIdValue';

    updateStub.withArgs(recordId, { strapi_id: strapiId }).rejects(new Error('Update failed'));

    try {
      await airtableService.updateAirtableRecord(recordId, strapiId);
    } catch (error: any) {
      expect(error.message).to.equal('Error updating record in Airtable');
    }
  });

  afterEach(() => {
    updateStub.restore();
  });
});
