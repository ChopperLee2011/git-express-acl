const Acl = require('acl'),
    Redis = require('redis'),
    GitVFactory = require('../utils/git-vendor-api');
var GitAcl = function (config) {
    this.db = Redis.createClient(config.dbport, config.dbhost, {no_ready_check: true});
    this.github = GitVFactory.create('github', config.github);

    this.acl = new Acl(new Acl.redisBackend(this.db), null, {
        buckets: {
            meta: 'Meta',
            parents: 'Parents',
            permissions: 'Permissions',
            resources: 'Resources',
            roles: 'Roles',
            users: 'Users'
        }
    });
};
GitAcl.prototype.create = function (owner, repos, boardId, userId) {
    const userRole = userId,
        publicRole = 'public',
        resource = '/board/' + boardId;
    return this.github.getFinalPermissionNum(owner, repos, userId).then((PermissionNum) => {
        //console.info('PermissionNum', PermissionNum);
        //create role
        if (!this.acl.hasRole(userId, userRole))
            this.acl.addUserRoles(userId, userRole);
        // public board
        if (PermissionNum & 4) {
            this.acl.addRoleParents(userRole, publicRole);
            this.acl.allow(publicRole, resource, ['get']);
        } else if (PermissionNum & 1) {
            this.acl.allow(userRole, resource, ['get']);
        }
        // Resource  --- Role
        if (PermissionNum & 2) {
            this.acl.allow(userRole, resource, ['put', 'post', 'delete']);
        }
        //console.log('create finished');
        return;
    }).catch((err)  => console.info('err', err));
    //webhook part

};

GitAcl.prototype.refresh = function (owner, repos, boardId, userId) {
    const userRole = userId,
        resource = '/board/' + boardId;
    //delete
    this.acl.removeRole(userRole); //remove role , should delete child-parent relation
    this.acl.removeResource(resource);//remove resource ,should delete role-user permission

    //create
    this.create(owner, repos, boardId, userId);
};
module.exports = GitAcl;