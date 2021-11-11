const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');
const { expect } = require('chai');

const crypto = require('crypto');

const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
// const repository = 'workshop-api-testing-js';
const zipMd5 = 'df39e5cda0f48ae13a5c5fe432d2aefa';
const readmeMd5 = '97ee7616a991aa6535f24053957596b1';

describe('Github Api users Test', () => {
  let reposUrl = '';
  describe('GET user', () => {
    it('Verify user data', async () => {
      const response = await agent.get(`${urlBase}/users/${githubUserName}`).auth('token', process.env.ACCESS_TOKEN).set('User-Agent', 'agent');
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.name).equal('Alejandro Perdomo');
      expect(response.body.company).equal('Perficient Latam');
      expect(response.body.location).equal('Colombia');
      reposUrl = response.body.repos_url;
    });
  });
  let repo;
  describe('GET repository', () => {
    it('get repo data', async () => {
      const response = await agent.get(reposUrl).auth('token', process.env.ACCESS_TOKEN).set('User-Agent', 'agent');
      expect(response.status).to.equal(statusCode.OK);
      repo = response.body.find((r) => r.name === 'jasmine-awesome-report');
      expect(repo.full_name).equal('aperdomob/jasmine-awesome-report');
      expect(repo.private).equal(false);
      expect(repo.description).equal('An awesome html report for Jasmine');
      const repoFile = await agent.get(`${urlBase}/repos/${repo.full_name}/zipball/${repo.default_branch}`).auth('token', process.env.ACCESS_TOKEN).set('User-Agent', 'agent');
      expect(repoFile.status).to.equal(statusCode.OK);
    });
    it('verify repo zip', async () => {
      const repoFile = await agent.get(`${urlBase}/repos/${repo.full_name}/zipball/${repo.default_branch}`).auth('token', process.env.ACCESS_TOKEN).set('User-Agent', 'agent');
      expect(repoFile.status).to.equal(statusCode.OK);
      const hashZip = crypto.createHash('md5').update(repoFile.body).digest('hex');
      expect(hashZip).to.equal(zipMd5);
    });
    let readmeFile;
    it('file list from repo', async () => {
      const repoFiles = await agent.get(`${urlBase}/repos/${repo.full_name}/contents`).auth('token', process.env.ACCESS_TOKEN).set('User-Agent', 'agent');
      expect(repoFiles.status).to.equal(statusCode.OK);
      expect(repoFiles.body).containSubset([{
        name: 'README.md',
        path: 'README.md',
        sha: '1eb7c4c6f8746fcb3d8767eca780d4f6c393c484'
      }]);
      readmeFile = repoFiles.body.find((f) => f.name === 'README.md');
    });
    it('verify md5 from readme', async () => {
      const readmeInfo = await agent.get(readmeFile.download_url).auth('token', process.env.ACCESS_TOKEN).set('User-Agent', 'agent');
      expect(readmeInfo.status).to.equal(statusCode.OK);
      const readmeHash = crypto.createHash('md5').update(readmeInfo.text).digest('hex');
      expect(readmeHash).to.equal(readmeMd5);
    });
  });
});
