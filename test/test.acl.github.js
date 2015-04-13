const GitVFactory = require('../utils/git-vendor-api'),
    GitAcl = require('../index'),
    server = require('../server/express'),
    app = require('express')(),
    config = require('../config'),
    chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    chaiHttp = require('chai-http');

//chai config
chai.use(chaiAsPromised);
chai.use(chaiHttp);


const user = {
        github_id: '2529258'
    },
    owner = 'chopperlee2011',
    repos = ['express-acl-demo', 'flux-github'],
    boardId = 'b123',
    gitAcl = new GitAcl(config);

//gitAcl.create('chopperlee2011', ['express-acl-demo', 'flux-github'], boardId, user.github_id);
describe('github', function () {
    before(function (done) {
        server.listen(8000, function (err, result) {
            if (err) done(err);
            else done();
        });
    });
    describe('create()', function () {
        it('should return permissoin number of the input repos', function (done) {
            let github = GitVFactory.create('github', config.github);
            github.getFinalPermissionNum(owner, repos, user.github_id).then(function (FinalPermissionNum) {
                FinalPermissionNum.should.equal(5);
                done();
            }, function (err) {
                done(err);
            })
        });
        it('should create tables for the acl base on github, and return 200', function (done) {
            gitAcl.create(owner, repos, boardId, user.github_id).then(function () {
                chai.request('http://localhost:8000')
                    .get('/')
                    .then(function (res) {
                        expect(res).to.have.status(200);
                    }, function (err) {
                        done(err);
                    });
            }, function (err) {
                done(err);
            });
        });
    });
});
