const Acl = require('acl'),
    Redis = require('redis'),
    GitVFactory = require('../util/git-verndor-api');

var GitAcl = function (config) {
    this.db = Redis.createClient(dbconfig.dbport, dbconfig.dbhost, {no_ready_check: true});
    this.github = gitVFactory.create('github', config.github);

    this.instance = new Acl(new Acl.redisBackend(this.db));
    return this.instance;
};
GitAcl.prototype.create = function (owner,repos) {

    let PermissionNum = this.github.getFinalPermissionNum(owner,repos);


};

GitAcl.prototype.refresh = function () {

};
module.exports = GitAcl;