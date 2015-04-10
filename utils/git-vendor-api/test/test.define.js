const gitVFactory = require('../'),
//config = require('../config/index');
    config = require('./config');
var github = gitVFactory.create('github', config.github),
    gitlab = gitVFactory.create('gitlab', config.gitlab);


describe('git vendor api', function () {
    it('defines github required operations', function (done) {
        github.login.should.be.a.function;
        github.getUser.should.be.a.function;
        github.getOrg.should.be.a.function;
        github.getRepo.should.be.a.function;
        github.getOrgRepo.should.be.a.function;
        github.getIssue.should.be.a.function;
        github.getComment.should.be.a.function;
        github.getLabel.should.be.a.function;

        //github.logout.should.be.a.function;

        done();

    });

    it('defines gitlab required operations', function (done) {
        gitlab.login.should.be.a.function;
        gitlab.getUser.should.be.a.function;
        gitlab.getOrg.should.be.a.function;
        gitlab.getRepo.should.be.a.function;
        gitlab.getOrgRepo.should.be.a.function;
        gitlab.getIssue.should.be.a.function;
        gitlab.getComment.should.be.a.function;
        github.getLabel.should.be.a.function;

        //gitlab.logout.should.be.a.function;

        done();

    })
});