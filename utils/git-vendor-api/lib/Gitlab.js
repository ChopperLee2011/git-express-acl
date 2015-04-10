const debug = require('debug')('gitlab'),
    GitVendor = require('./GitVendor');
function Gitlab(config = {}) {
    this._apiUrl = config.API_URL;
    this._token = config.GITLAB_TOKEN;
};

Gitlab.prototype = Object.create(GitVendor);
Gitlab.prototype.constructor = Gitlab;
Gitlab.prototype.login = function () {
    return this.request("GET", "/user");
};

//user
Gitlab.prototype.getUser = function () {
    let path = "/users";
    return this.request("GET", path).then(function (res) {
    });
};
//group
Gitlab.prototype.getOrg = function () {
    let path = "/groups";
    return this.request("GET", path).then(function (res) {
    });
};
//project
Gitlab.prototype.getUserRepo = function () {
    let path = "/projects/all";
    return this.request("GET", path).then(function (res) {
    });
};

Gitlab.prototype.getOrgRepo = function (orgName) {
    let path = `/groups/${orgName}/repos`;
    return this.request("GET", path).then(function (res) {
    });
};

//hook
Gitlab.prototype.getUserRepo = function (repo, hookid) {
    let path = `/projects/${repo}/hooks/${hookid}`;
    return this.request("GET", path).then(function (res) {
    });
};

//issue
Gitlab.prototype.getIssue = function (repoPath) {
    let path = `${repoPath}/commits`;
    return this.request("GET", path).then(function (res) {
    });
};
Gitlab.prototype.getLabel = function (owner, repo) {
    let path = `/groups/${owner}/${repo}/labels`;
    return this.request("GET", path).then(function (res) {
    });
};
Gitlab.prototype.updateLabel = function (owner, repo, label) {
    let path = `/groups/${owner}/${repo}/labels/${label}`;
    return this.request("PATCH", path).then(function (res) {
    });
};

Gitlab.prototype.createLabel = function (owner, repo) {
    let path = `/groups/${owner}/${repo}/labels`;
    return this.request("POST", path).then(function (res) {
    });
};


Gitlab.prototype.getCommit = function (repoPath) {
    let path = `${repoPath}/commits`;
    return this.request("GET", path).then(function (res) {
    });
};

module.exports = Gitlab;