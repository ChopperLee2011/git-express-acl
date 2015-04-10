const gitVFactory = require('../utils/git-vendor-api'),
    config = require('../config');


var github = gitVFactory.create('github', config.github);
var user = {
    github_id: 2529258
};
var FinalPermissionNum;
var test = github.getFinalPermissionNum('chopperlee2011', ['express-acl', 'flux-github'], user);
//.then(
//    FinalPermissionNum => console.info('FinalPermissionNum', FinalPermissionNum));

