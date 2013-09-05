var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	database = require('./db'),
	flash = require('connect-flash');

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
	} else {
		res.redirect('/login.html');
	}
}

function findUser(q, callback) {
	var db = database.getConnection();
	db.collection('users').find(q).toArray(function(err, result) {
		var user;
		if (!err && result && result[0]) {
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
		app.use(flash());
		app.use(passport.initialize());
		app.use(passport.session());
		app.post('/login', passport.authenticate('local', {
			failureRedirect: '/login.html',
			failureFlash: true
		}), function(req, res) {
			res.redirect('/admin')
		});
		app.get('/logout', function(req, res) {
			req.logout();
			res.redirect('/');
		});
		app.post('/getProfile', function(req, res) {
			if (req.user) {
				res.json(req.user);
			} else {
				res.send(null);
			}
		});
	},

	ensureAuthenticated: ensureAuthenticated
};