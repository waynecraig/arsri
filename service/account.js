var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	database = require('./db');

passport.use(new LocalStrategy(
	function(username, password, done) {
		findUser({
			username: username
		}, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					message: 'Incorrect username.'
				});
			}
			if (!user.validPassword(password)) {
				return done(null, false, {
					message: 'Incorrect password.'
				});
			}
			return done(null, user);
		});
	}
));
passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
}

function findUser(q, callback) {
	var db = database.getConnection();
	db.collection('users').find(q).toArray(function(err, result) {
		var user;
		if (!err) {
			user = result[0];
			user.validPassword = function(password) {
				if (this.password == password) {
					return true;
				} else {
					return false;
				}
			};
		}
		callback(err, user);
	});
}

module.exports = {
	init: function(app) {
		app.use(passport.initialize());
		app.use(passport.session());
		app.post('/login', passport.authenticate('local'), function(req, res) {
			res.send('welcome! ' + req.user.displayName);
		});
		app.post('/logout', function(req, res) {
			req.logout();
			res.redirect('/');
		});
	},

	ensureAuthenticated: ensureAuthenticated
};