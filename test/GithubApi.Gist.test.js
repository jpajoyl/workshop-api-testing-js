const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
// const githubUserName = 'jpajoyl';
// const repository = 'workshop-api-testing-js';
let gists;
describe('Github Api DELETE method Test', () => {
  describe('Create gists', () => {
    it('POST method to create gists', async () => {
      const response = await agent.post(`${urlBase}/gists`)
        .auth('token', process.env.ACCESS_TOKEN)
        .send({
          description: 'gists test',
          files: {
            '1.json': {
              content: '{}'
            }
          },
          public: true
        })
        .set('User-Agent', 'agent');
      expect(response.status).to.equal(statusCode.CREATED);
      expect(response.body).containSubset({
        description: 'gists test',
        public: true,
        files: {
          '1.json': {
            content: '{}'
          }
        }
      });
      gists = response.body;
    });
  });
  describe('Verify gists exist', () => {
    it('GET method to verify gists', async () => {
      const response = await agent.get(gists.url)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
      expect(response.status).to.equal(statusCode.OK);
    });
  });
  describe('Delete gists', () => {
    it('DELETE method to delete gists', async () => {
      const response = await agent.delete(`${urlBase}/gists/${gists.id}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
      expect(response.status).to.equal(statusCode.NO_CONTENT);
    });
  });
  describe('Verify gists exist again', () => {
    it('GET method to verify gists', async () => {
      let response;
      try {
        response = await agent.get(gists.url)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');
      } catch (e) {
        response = e;
      }
      expect(response.status).to.equal(statusCode.NOT_FOUND);
    });
  });
});
