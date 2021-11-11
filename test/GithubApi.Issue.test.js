const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
// const githubUserName = 'jpajoyl';
const repository = 'workshop-api-testing-js';

let user;
let issue;

describe('Github Api POST and PATCH Test', () => {
  describe('Verify user repos', () => {
    it('public repos', async () => {
      const response = await agent.get(`${urlBase}/user`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
      user = response.body;
      expect(response.status).to.equal(statusCode.OK);
      expect(user.public_repos).greaterThan(0);
    });
  });
  describe('get user repos', () => {
    it('verify repos', async () => {
      const response = await agent.get(`${urlBase}/user/repos`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body).containSubset([{
        name: repository
      }]);
    });
  });
  describe('add issue to existing repo', () => {
    it('adding issue', async () => {
      const response = await agent.post(`${urlBase}/repos/${user.login}/${repository}/issues`)
        .auth('token', process.env.ACCESS_TOKEN)
        .send({
          title: 'Example title for api test'
        })
        .set('User-Agent', 'agent');
      expect(response.status).to.equal(statusCode.CREATED);
      expect(response.body.title).to.equal('Example title for api test');
      expect(response.body.body).to.equal(null);
      issue = response.body;
    });
  });
  describe('edit issue to existing repo', () => {
    it('edit issue', async () => {
      const response = await agent.patch(`${urlBase}/repos/${user.login}/${repository}/issues/${issue.number}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .send({
          body: 'Example body for api test'
        })
        .set('User-Agent', 'agent');
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.title).to.equal('Example title for api test');
      expect(response.body.body).to.equal('Example body for api test');
    });
  });
});
