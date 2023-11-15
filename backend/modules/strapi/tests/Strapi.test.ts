import { expect } from 'chai';
import sinon, { SinonStub } from 'sinon';
import axios from 'axios';
import { StrapiService } from '../Strapi'; 

describe('findUser', () => {
  let strapiService: StrapiService;
  let getStub: SinonStub;

  beforeEach(() => {
    strapiService = new StrapiService();
    getStub = sinon.stub(axios, 'get');
  });

  it('should find user in Strapi and throw error if user exists', async () => {
    const email = 'test@example.com';
    const responseData = {
      data: [
        {
          attributes: {
            email: email,
          },
        },
      ],
    };

    getStub.resolves({ data: responseData });

    try {
      await strapiService.findUser(email);
    } catch (error: any) {
      expect(error.message).to.equal('User with this email already exists');
    }
  });

  it('should catch error if request to Strapi fails', async () => {
    const email = 'test@example.com';

    getStub.rejects(new Error('Failed to fetch user data'));

    try {
      await strapiService.findUser(email);
    } catch (error: any) {
      expect(error.message).to.equal('Error checking user in Strapi');
    }
  });

  afterEach(() => {
    getStub.restore();
  });
});

describe('createUser', () => {
  let strapiService: StrapiService;
  let getStub: SinonStub;
  let postStub: SinonStub;

  beforeEach(() => {
    strapiService = new StrapiService();
    getStub = sinon.stub(axios, 'get');
    postStub = sinon.stub(axios, 'post');
  });

  it('should create a new user in Strapi', async () => {
    const email = 'test@example.com';
    const airtableId = '12345';
    const responseData = {
      data: {
        data: {
          id: 'newUserId',
        },
      },
    };

    getStub.resolves({ data: [] });
    postStub.resolves(responseData);

    const newItemId = await strapiService.createUser(email, airtableId);
    expect(newItemId).to.equal('newUserId');
  });

  it('should catch error if user creation in Strapi fails', async () => {
    const email = 'test@example.com';
    const airtableId = '12345';

    getStub.resolves({ data: [] });
    postStub.rejects(new Error('Failed to create user'));

    try {
      await strapiService.createUser(email, airtableId);
    } catch (error: any) {
      expect(error.message).to.equal('Error creating user in Strapi');
    }
  });

  afterEach(() => {
    getStub.restore();
    postStub.restore();
  });
});
