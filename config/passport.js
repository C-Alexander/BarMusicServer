const localStrategy = require('passport-local').Strategy;
const user = require('../db/models').user;
const request = require('request');

const CLIENT_ID = 'MusicAdmin';
const CLIENT_SECRET = 'fcf5989d-8c2b-4dec-9c0d-b61d471b033c';
const base64 = require('base-64');

module.exports = function (passport) {

    passport.serializeUser((user, callback) => callback(null, user.id));
    passport.deserializeUser((id, callback) => {
        console.log('deserializing');
        user.findOne({where: {id: id}})
        .then(usr => {
            if (usr.expires_at > (new Date() + 2000)) return callback(null, usr);
            request.post(
                'http://maatwerk.works/oauth/token',
                {
                    form: {grant_type: 'refresh_token', refresh_token: usr.refresh_token},
                    headers: {
                        'Authorization': 'Basic ' + base64.encode(CLIENT_ID + ':' + CLIENT_SECRET)
                    }
                },
                (error, response, body) => {
                    if (error) return console.log(error);
                    if (!error) {
                        const newToken = JSON.parse(body);
                        if (!newToken.access_token)  {
                            req.session.destroy();
                            req.logout();
                            return response.redirect('/login');
                        }
                        usr.update({
                            access_token: newToken.access_token,
                            refresh_token: newToken.refresh_token,
                            expires_at: new Date(new Date + (newToken.expires_in * 1000))})
                    }
                });
            return callback(null, usr);

        })
    });

    passport.use(new localStrategy((username, password, callback) => {
        if (!username || !password) return callback(null, false, {message: 'Please fill in a username and password'});
        request.post(
            'http://maatwerk.works/oauth/token',
            {
                form: {grant_type: 'password', username: username, password: password, scope: 'Jukebox'},
                headers: {
                    'Authorization': 'Basic ' + base64.encode(CLIENT_ID + ':' + CLIENT_SECRET)
                }
            },
            (error, response, body) => {
                if (error) return console.log(error);
                if (!error) {
                    const result = JSON.parse(body);
                    if (!result.access_token) return callback(null, false, {message: 'Wrong username or password'});
                    request.get(
                        'http://maatwerk.works/oauth/me',
                        {
                            headers: {
                                'Authorization': 'Bearer ' + result.access_token
                            }
                        },
                        (error, response, body) => {
                            if (error) return console.log(error);
                            if (!error) {
                                const profile = JSON.parse(body);

                                user.findOne({where: {id: profile.id}})
                                    .then(usr => {
                                        const date = new Date(new Date + (result.expires_in * 1000));
                                        if (!usr) {
                                            return user.create({
                                                id: profile.id,
                                                username: profile.username,
                                                access_token: result.access_token,
                                                refresh_token: result.refresh_token,
                                                expires_at: date
                                            });
                                        } else {
                                            return usr.update({
                                                username: profile.username,
                                                access_token: result.access_token,
                                                refresh_token: result.refresh_token,
                                                expires_at: date
                                            })
                                        }
                                    })
                                    .then(resultingUser => callback(null, resultingUser));
                            }
                        }
                    );
                }
            }
        );
    }));
};