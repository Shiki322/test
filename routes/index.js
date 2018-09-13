let controller = require("../controllers");
let path = require('path');
let jwt = require('jsonwebtoken');
let ejs = require('ejs');

function isNotAnEmptyString(something) {
    if (typeof(something) === 'string') {
        return !!something.trim();
    }
    return false;
}

module.exports = function (app) {

    function isAuth(req, res, next) {
        if (!req.query.token) {
            return res.redirect('/login');
        }

        let token = req.query.token;


        jwt.verify(token, "secret", function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {

                req.decoded = decoded;
                next();
            }
        });
    }

    app.set('view engine', 'ejs');
    app.get('/signup', (req, res) => {

        return res.render('signup')
    });
    app.post('/signup', (req, res) => {
        let username = req.body.username.toString();
        let password = req.body.password;
        if (!isNotAnEmptyString(username)) {
            return res.send({success: false, error: "username field cannot be null"})
        }
        if (username.length > 30) {
            return res.send({success: false, message: "max username length = 30"});
        }
        if (!isNotAnEmptyString(password)) {
            return res.send({success: false, error: "password field cannot be null"});
        }
        if (password.length > 100) {
            return res.send({success: false, error: "max password length = 100"});
        }
        return controller.signup(req, res, username, password);
    });

    app.get('/login', (req, res) => {

        return res.render('login')
    });
    app.post('/login', (req, res) => {
        return controller.login(req, res)
    });

    app.get('/game', isAuth, (req, res) => {
        res.render('game', {decoded: req.decoded});
    });

    app.get('*', (req, res) => {
        res.redirect('/login')
    })
};
