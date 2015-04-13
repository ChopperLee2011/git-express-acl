var express = require("express"),
    http = require("http"),
    path = require("path"),
    Redis = require('redis'),
    Acl = require("acl"),
    GitAcl = require('../'),
    config = require('../config');

//test value

var userId = 'u123',
    userName = 'guest',
    userRole = 'u123',
    normalRole = 'normal',
    boardId = 'b123',
    resource = '/board/' + boardId;

/*
 * ------------------------------------------------
 * Create App and configure
 */


var app = express(),
    serPort = process.env.PORT || 4000,
    dboptions = {
        host: '127.0.0.1',
        port: 6379,
        password: null
    };

/*
 * ------------------------------------------------
 * ACL
 */
var redis = Redis.createClient(dboptions.port, dboptions.host, {no_ready_check: true});
var acl = new Acl(new Acl.redisBackend(redis), null, {
    buckets: {
        meta: 'Meta',
        parents: 'Parents',
        permissions: 'Permissions',
        resources: 'Resources',
        roles: 'Roles',
        users: 'Users'
    }
});
//var acl = new Acl(this.backend, null, {
//    buckets: {
//        parents: 'Parents',
//        permissions: 'Permissions',
//        resources: 'Resources',
//        roles: 'Roles',
//        users: 'Users'
//    }
//});
// Role --- User
//acl.addUserRoles(userId, userRole);
////acl.addUserRoles(userId, 'test');
//acl.addRoleParents(userRole, normalRole);
//// Resource  --- Role
//acl.allow(normalRole, resource, ['get']);
//acl.allow(userRole, resource, ['put']);
//
//// check allow
//acl.isAllowed(userId, resource, ['get', 'put'], function (err, allowed) {
//    console.info('userId', userId);
//    console.info('resource', resource);
//
//    console.log('allowed: ' + allowed);
//});

/*
 * ------------------------------------------------
 * General middleware
 */

app.set("port", serPort);
app.set('views', path.join(__dirname, '../', 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('a very secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, "../", "public")));

/*
 * ------------------------------------------------
 * Configure by environment
 */
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

/*
 * ------------------------------------------------
 * Routes
 */


var route = function (req, res) {
    req.session.userId = '2529258';
    res.json({
        route: req.route.path,
        verb: req.method
    });
};

app.get('/', route);
app.get('/board', route);
app.post('board', route);
app.get('/board/:boardId', acl.middleware(), route);
app.post('/board/:boardId', acl.middleware(), route);
app.put('/board/:boardId', acl.middleware(), route);
app.delete('/board/:boardId', acl.middleware(), route);


/*
 * ------------------------------------------------
 * Create Server
 */

//module.exports = app;
//var server = http.createServer(app);

exports.listen = function (port, cb) {
    console.log("Express server listening on port " + port || app.get("port"));
    console.log("Node Environment: " + app.get("env"));
    app.listen(port || app.get("port"), cb());
};
//exports.close = function () {
//    console.log("Closing server");
//    app.close();
//};



