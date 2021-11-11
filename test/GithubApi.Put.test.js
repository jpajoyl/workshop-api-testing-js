const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
// const githubUserName = 'jpajoyl';
// const repository = 'workshop-api-testing-js';
const usernameToFollow = 'aperdomob';

describe('Github Api Test PUT method', () => {
  describe('Follow user', () => {
    it('put request to follow user', async () => {
      const response = await agent.put(`${urlBase}/user/following/${usernameToFollow}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent')
        .send({
          username: usernameToFollow
        });
      expect(response.status).to.equal(statusCode.NO_CONTENT);
      expect(response.body).to.eql({});
    });
    it('get request to verify followed user', async () => {
      const response = await agent.get(`${urlBase}/user/following`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).containSubset([{
        login: 'aperdomob'
      }]);
    });
    it('verify idempotency', async () => {
      let response = await agent.put(`${urlBase}/user/following/${usernameToFollow}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent')
        .send({
          username: usernameToFollow
        });
      expect(response.status).to.equal(statusCode.NO_CONTENT);
      expect(response.body).to.eql({});
      response = await agent.get(`${urlBase}/user/following`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).containSubset([{
        login: 'aperdomob'
      }]);
    });
  });
});
