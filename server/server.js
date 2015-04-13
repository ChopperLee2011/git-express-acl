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
    port = process.env.PORT || 4000,
    dboptions = {
        host: '127.0.0.1',
        port: 6379,
        password: null
    };
var redis = Redis.createClient(dboptions.port, dboptions.host, {no_ready_check: true});
this.backend = new Acl.redisBackend(redis);
var acl = new Acl(this.backend, null, {
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

app.set("port", port);
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
 * Models
 */

//var userSchema = new mongoose.Schema({
//    username: {type: String, unique: true},
//    email: {type: String, unique: true},
//    password: {type: String, required: true},
//    roles: {type: [String], default: "guest"}
//});
//
//mongoose.model('User', userSchema);
//var User = mongoose.model('User');

//var saveCallback = function (err, user) {
//    if (!err) {
//        console.log("_____________________________________");
//        console.log("New User");
//        console.log("username:   " + user.username);
//        console.log("role:       " + user.roles[0]);
//
//    }
//};


//guestUser.save(saveCallback);
//userUser.save(saveCallback);
//adminUser.save(saveCallback);

// assign a user for the purposes of testing
//var selectedUser = guestUser;

/*
 * ------------------------------------------------
 * Routes
 */


var route = function (req, res) {
    //var userId = req.userId ? req.userId : 'u123';
    //var username = req.session.user ? req.session.user.username : "";
    //var roles = req.session.user ? req.session.user.roles : "";
    //
    req.session.userId = '2529258';
    //req.session.user = selectedUser;
    res.json({
        route: req.route.path,
        verb: req.method
        //roles: roles
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
 * ACL
 */
//nodeAcl.allow('guest', 'books', 'view');
//app.use(nodeAcl.middleware(1,'5524fd04915537618cc3206d,','view'));

//nodeAcl.allow('guest', 'books', 'view'); // throws error
//nodeAcl.allow('admin', ['books', 'users'], '*'); // throws error


/*
 * ------------------------------------------------
 * Create Server
 */

http.createServer(app).listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
    console.log("Node Environment: " + app.get("env"));
});

process.on("SIGINT", function () {
    console.warn("Express server listening on port " + app.get("port") + " exiting");
    process.exit(0);
});



