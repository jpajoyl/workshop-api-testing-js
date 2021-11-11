const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

// const urlBase = 'https://api.github.com';
// const githubUserName = 'jpajoyl';
// const repository = 'workshop-api-testing-js';

describe('Github Api HEAD Test', () => {
  describe('Get info to redirect app', () => {
    it('Head to get data', async () => {
      let response;
      try {
        response = await agent.head('https://github.com/aperdomob/redirect-test')
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');
      } catch (e) {
        response = e;
      }
      expect(response.status).to.equal(statusCode.MOVED_PERMANENTLY);
      expect(response.response.headers.location).to.equal('https://github.com/aperdomob/new-redirect-test');
    });
    it('get to verify redirection', async () => {
      let response;
      try {
        response = await agent.get('https://github.com/aperdomob/redirect-test')
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');
      } catch (e) {
        response = e;
      }
      expect(response.status).to.equal(statusCode.OK);
      expect(response.redirects[0]).to.equal('https://github.com/aperdomob/new-redirect-test');
    });
  });
});
