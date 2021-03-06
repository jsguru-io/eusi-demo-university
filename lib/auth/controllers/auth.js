const Context = require('../../../utils/context');
const eusi = require('../../content');

let template = __dirname + '/../views/join';
exports.index = function (req, res) {
    let context = Context.create(req, {
        error: null,
        title: "Join | Eusi University",
        settings: {
            active: 'join'
        }
    });

    res.render(template, context);

};


exports.register = function (req, res, next) {

    let input = req.body;

    eusi
        .register({
            email: input.email,
            password: input.password,
            firstName: input.first_name,
            lastName: input.last_name
        })
        .then((user) => {
            if (user.token) {
                res.cookie('auth_token', user.token);
                res.redirect("/");
            }
        })
        .catch(next);
};

exports.login = function (req, res) {
    const input = req.body;
    const  template = __dirname + '/../views/join';
    const context = Context.create(req, {
        title: "Join | Eusi University",
        settings: {
            active: 'join'
        }
    });

    eusi
        .login(input.email, input.password)
        .then((user) => {
            if (user.token) {
                console.log('LOGGED USER', JSON.stringify(user));
                res.cookie('auth_token', user.token);
                res.redirect("/");
            }
        })
        .catch((response) => {
            console.log("ERROR", response);
            res.render(template, Context.apply(context, {
                error: {
                    message: 'Wrong username or password!',
                    status: response.statusCode
                }
            }));
        });
};

exports.logout = (req, res) => {
    if (req.cookies.auth_token) {
        res.clearCookie('auth_token');
    }
    res.redirect('/');
};