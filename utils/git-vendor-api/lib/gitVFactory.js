const Github = require('./Github'),
    Gitlab = require('./Gitlab');

// TODO:ops is otoken for now;
var gitVFactory = {
    create: function (name, config) {
        switch (name) {
            case 'github':
                return new Github(config);
            case 'gitlab':
                return new Gitlab(config);
            default:
                return null;
        }
    }
};

module.exports = gitVFactory;