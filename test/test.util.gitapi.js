const gitVFactory = require('../utils/git-vendor-api'),
    GitAcl = require('../index'),
    config = require('../config'),
    assert = require('assert');

//const github = gitVFactory.create('github', config.github),
const user = {
        github_id: '2529258'
    },
    owner = 'chopperlee2011',
    repos = ['express-acl-demo', 'flux-github'],
    boardId = 'b123',
    gitAcl = new GitAcl(config);
gitAcl.create('chopperlee2011', ['express-acl-demo', 'flux-github'], boardId, user.github_id);
//describe('github', function () {
//    describe('create()', function () {
//        it('should return permissoin number of the input repos', function () {
//            let github = gitVFactory.create('github', config.github);
//            github.getFinalPermissionNum(owner, repos, user).
//                then(function (FinalPermissionNum) {
//                    assert.equal(FinalPermissionNum, 5);
//                });
//        });
//        it('should create tables for the acl base on github', function () {
//            gitAcl.create(owner, repos, boardId, user.github_id);
//        });
//    });
//});
