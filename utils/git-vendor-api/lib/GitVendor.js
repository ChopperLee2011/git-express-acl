const debug = require('debug')('gitVendor'),
    through2 = require('through2'),
//xhr = require('xhr');
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
function GitVendor(ops = {}) {
    this._apiUrl = ops.API_URL;
    this._token = ops.token;
};
//TODO:paging request xmlhttprequest do not find query

GitVendor.prototype.request = function (method = "GET", path = "", data) {
    let token = this._token,
    //agent = this.agent(),
        req = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                if ([200, 304].indexOf(req.status) === -1) {
                    reject(req);
                } else {
                    resolve(req.responseText);
                }
            }
        };
        req.open(method, this._apiUrl + path);
        req.dataType = "json";
        req.setRequestHeader('Accept', 'application/vnd.github.v3.raw+json');
        req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        req.setRequestHeader('Authorization', 'token ' + token);
        if (data)
            req.send(JSON.stringify(data));
        else
            req.send();
    });
};
GitVendor.prototype.streamRequest = function (ops) {
    start = ops.page ? ops.page : 1;
    perPage = ops.perPage ? ops.perPage : 30;
    return through2.obj((chunk, enc, done)  => {
        let _request = (_this) => {
            return function (page) {
                return this.request(chunk, _.extend({}, options, {
                    page: page
                }), function (err, body) {
                    var i, item, len;
                    if (err) {
                        return done(err);
                    }
                    if (!_.isArray(body)) {
                        _this.push(body);
                        return done();
                    }
                    for (i = 0, len = body.length; i < len; i++) {
                        item = body[i];
                        _this.push(item);
                    }
                    if (_.size(body) < perPage) {
                        return done();
                    }
                    return _request(page + 1);
                });
            };
        };
        return _request(start);
    });
};

//TODO:
GitVendor.prototype.cachedRequest = function (urls, options, cacheOptions) {
    var _request, context, data, key, ref, ref1, ref2, stream, ttl, updated, updatedKey;
    if (_.isString(urls)) {
        urls = [urls];
    }
    _request = (function (_this) {
        return function () {
            return highland.pipeThrough(urls, _this.streamRequest(options)).map(Github.cleanItem);
        };
    })(this);
    if (!_.isObject(cacheOptions)) {
        return _request();
    }
    context = (ref = cacheOptions.context) != null ? ref : this;
    key = cacheOptions.key;
    if ((key == null) || !_.isFunction(context[key])) {
        return _request();
    }
    if (cacheOptions.updated != null) {
        updated = cacheOptions.updated;
    } else {
        updatedKey = (ref1 = cacheOptions.updatedKey) != null ? ref1 : key + '|updated';
        updated = typeof context[updatedKey] === "function" ? context[updatedKey]() : void 0;
    }
    data = context[key]();
    ttl = (ref2 = cacheOptions.ttl) != null ? ref2 : Infinity;
    if ((data != null) && (updated != null) && updated >= (moment().unix() - ttl)) {
        return highland(data);
    }
    stream = _request().reduce([], function (items, item) {
        items.push(item);
        return items;
    }).map(function (items) {
        context[key](items);
        return typeof context[updatedKey] === "function" ? context[updatedKey](moment().unix()) : void 0;
    }).flatten();
    return stream;
};
module.exports = GitVendor;