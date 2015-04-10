import test from 'tape';
import Github from'../lib/GitHub';
import Gitlab from '../lib/GitLab';
import test_user from './user.json';

test("Token GitHub Auth - Pass", function (t) {
    var timeout = setTimeout(function () {
        t.fail();
    }, 10000);
    var github = new Github(
        test_user.GITHUB_TOKEN
    );
    github.login().then(function (res) {
        t.pass();
        t.end();
    }).catch(function (err) {
        t.error(err);
    });
    clearTimeout(timeout);
});

test("Token GitLab Auth - Pass", function (t) {
    var timeout = setTimeout(function () {
        t.fail();
    }, 10000);
    var gitlab = new Gitlab(
        test_user.GITLAB_TOKEN,
        'https://gitlab.com/api/v3/user'
    );
    gitlab.login().then(function (res) {
        t.pass();
        t.end();
    }).catch(function (err) {
        t.error(err);
    });
    clearTimeout(timeout);
});

test("Token GitHub Auth - Fail", function (t) {
    var timeout = setTimeout(function () {
        t.fail();
    }, 10000);
    var github = new Github(
        test_user.FAKER_TOKEN
    );
    github.login().then(function (res) {
        t.pass();
    }).catch(function (err) {
        t.error('login');
        t.end();
    });
    clearTimeout(timeout);
});

test("Token GitLab Auth - Fail", function (t) {
    var timeout = setTimeout(function () {
        t.fail();
    }, 10000);
    var gitlab = new Gitlab(
        test_user.FAKER_TOKEN,
        'https://gitlab.com/api/v3/user'
    );
    gitlab.login().then(function (res) {
        t.pass();
    }).catch(function (err) {
        t.error('login');
        t.end();

    });
    clearTimeout(timeout);
});
