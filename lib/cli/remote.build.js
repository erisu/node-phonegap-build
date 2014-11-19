/*!
 * Module dependencies.
 */

var pgbuild = require('../main');
var console = require('./console');
var login = require('./remote.login');

/**
 * $ phonegap remote build <platform>
 *
 * Build a specific platform. Eventually, it should support building multiple
 * platforms.
 *
 * The `phonegap.remote.build()` function will handle login requirements and
 * the login event handler is set with the CLI login function.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 *     - `data` {Object} describes the built app.
 */

module.exports = function(argv, callback) {
    // display help when missing required parameter <platform>
    // $ phonegap remote build
/*
    if (argv._.length <= 2) {
        argv._.unshift('help');
        this.cli.argv(argv, callback);
        return;
    }
*/
    // build data
    var data = {
        platforms: [argv._[1]]
    };

    // validate platform data
console.log('wut');
    if ((data.platforms[0]) !== 'android') {
        callback(new Error('platform ' + data.platforms[0] + ' not recognized'));
    }

    // console.prompt setup
    var promptOptions = {
        // use provided values
        override: data,

        // prompt properties
        data: {
            properties: {
                username: {
                    required: true,
                    description: 'enter username:'
                },
                password: {
                    hidden: true,
                    required: true,
                    description: 'enter password:'
                }
            }
        }
    };

    var execute = function (data, callback) {
        pgbuild.build(data, function(e, data) {
            if (!e) {
                console.log("build complete");
                console.log("error: ", e,"data: ",  data);
            }
            callback(e, data);
        });
    };
console.log("attempt to login");
    // call login with empty options
    login({}, function(e, data) {
        console.log("error",e,"data",data);
        if (e) {
            // begin prompting
            console.prompt(promptOptions, function(e, result) {
                console.log('login callback');
                if(e) {
                    console.log("ERROR");
                    callback(e, result);
                    return;
                }
                
                login(result, function(e,d) {
                    console.log('login with result of prompt');
                    console.log(e, d);
                    execute(data, callback);
               });
            }); 
        } else {
            execute(data, callback);
        }
    });
};