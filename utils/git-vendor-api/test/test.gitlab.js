const test = require('tape'),
    gitVFactory = require('../lib/gitVFactory'),
    config = require('./config');

test("Github API", function (t) {
    var timeout = setTimeout(function () {
        t.fail();
    }, 100000);
    var gitlab = gitVFactory.create('gitlab', config.gitlab);


    t.test('get user', function (q) {
        gitlab.getUser().then(function (res) {
            q.pass();
            q.end();
        }).catch(function (err) {
            t.error(err);
        });
    });
    t.test('get orgs', function (q) {
        gitlab.getOrgs().then(function (res) {
            q.pass();
            q.end();
        }).catch(function (err) {
            t.error(err);
        });
    });
    t.test('get repos', function (q) {
        gitlab.getRepo().then(function (res) {
            q.pass();
            q.end();
        }).catch(function (err) {
            t.error(err);
        });
    });

    clearTimeout(timeout);
    t.end();

});