module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
const devConfig = {
    MONGO_URL: 'mongodb://localhost/api6_0-dev',
    JWT_SECRET: 'thisisasecret'
};
const testConfig = {
    MONGO_URL: 'mongodb://localhost/api6_0-test'
};
const prodConfig = {
    MONGO_URL: 'mongodb://localhost/api6_0-prod'
};
const defaultConfig = {
    PORT: process.env.PORT || 3000
};

function envConfig(env) {
    switch (env) {
        case 'development':
            return devConfig;
        case 'test':
            return testConfig;
        default:
            return prodConfig;
    }
}

exports.default = Object.assign({}, defaultConfig, envConfig(process.env.NODE_ENV));

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = __webpack_require__(3);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validator = __webpack_require__(30);

var _validator2 = _interopRequireDefault(_validator);

var _bcryptNodejs = __webpack_require__(21);

var _jsonwebtoken = __webpack_require__(25);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongooseUniqueValidator = __webpack_require__(10);

var _mongooseUniqueValidator2 = _interopRequireDefault(_mongooseUniqueValidator);

var _post = __webpack_require__(4);

var _post2 = _interopRequireDefault(_post);

var _user = __webpack_require__(5);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserSchema = new _mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required!'],
        trim: true,
        validate: {
            validator(email) {
                return _validator2.default.isEmail(email);
            },
            message: '{VALUE} is not a valid email!'
        }
    },
    firstName: {
        type: String,
        required: [true, 'FirstName is required!'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'LastName is required!'],
        trim: true
    },
    userName: {
        type: String,
        required: [true, 'UserName is required!'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        trim: true,
        minlength: [6, 'Password need to be longer!'],
        validate: {
            validator(password) {
                return _user.passwordReg.test(password);
            },
            message: '{VALUE} is not valid password!'
        }
    },
    favorites: {
        posts: [{
            type: _mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }]
    }
}, { timestamp: true });

UserSchema.plugin(_mongooseUniqueValidator2.default, {
    message: '{VALUE} already taken!'
});
UserSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = this._hashPassword(this.password);
    }
    return next();
});

UserSchema.methods = {
    _hashPassword(password) {
        return (0, _bcryptNodejs.hashSync)(password);
    },
    authenticateUser(password) {
        return (0, _bcryptNodejs.compareSync)(password, this.password);
    },
    createToken() {
        return _jsonwebtoken2.default.sign({
            _id: this._id
        }, _constants2.default.JWT_SECRET);
    },
    toAuthJSON() {
        return {
            _id: this._id,
            userName: this.userName,
            token: `JWT ${this.createToken()}`
        };
    },
    toJSON() {
        return {
            _id: this._id,
            userName: this.userName
        };
    },
    _favorites: {
        async posts(postId) {
            if (this.favorites.posts.indexOf(postId) >= 0) {
                this.favorites.posts.remove(postId);
                await _post2.default.decFavoriteCount(postId);
            } else {
                this.favorites.posts.push(postId);
                await _post2.default.incFavoriteCount(postId);
            }
            return this.save();
        },
        isPostIsFavorite(postId) {
            return this.favorites.posts.indexOf(postId) >= 0;
        }
    }
};

exports.default = _mongoose2.default.model('User', UserSchema);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = __webpack_require__(3);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _slug = __webpack_require__(29);

var _slug2 = _interopRequireDefault(_slug);

var _mongooseUniqueValidator = __webpack_require__(10);

var _mongooseUniqueValidator2 = _interopRequireDefault(_mongooseUniqueValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PostSchema = new _mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Title is required!'],
        minlength: [3, 'Title need to be longer!'],
        unique: true
    },
    text: {
        type: String,
        trim: true,
        required: [true, 'Text is required!'],
        minlength: [10, 'Text need to be longer!']
    },
    slug: {
        type: String,
        trim: true,
        lowercase: true
    },
    user: {
        type: _mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    favoriteCount: {
        type: Number,
        default: 0
    }
}, { timestamp: true });

PostSchema.plugin(_mongooseUniqueValidator2.default, {
    message: '{VALUE} already taken!'
});
PostSchema.pre('validate', function (next) {
    this._slugify();
    next();
});
PostSchema.methods = {
    _slugify() {
        this.slug = (0, _slug2.default)(this.title);
    },
    toJSON() {
        return {
            _id: this._id,
            title: this.title,
            text: this.text,
            createdAt: this.createdAt,
            slug: this.slug,
            user: this.user,
            favoriteCount: this.favoriteCount
        };
    }
};
PostSchema.statics = {
    createPost(args, user) {
        return this.create(Object.assign({}, args, {
            user
        }));
    },
    list({ skip = 0, limit = 5 } = {}) {
        return this.find().sort({ _id: -1 })
        //має бути createdAt, але його не відображає в Postman вроді
        // після того як подобовлял toJSON(приблизно 6-8 епізод)
        .skip(skip).limit(limit).populate('user');
    },
    incFavoriteCount(postId) {
        return this.findByIdAndUpdate(postId, { $inc: { favoriteCount: 1 } });
    },
    decFavoriteCount(postId) {
        return this.findByIdAndUpdate(postId, { $inc: { favoriteCount: -1 } });
    }
};

exports.default = _mongoose2.default.model('Post', PostSchema);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.passwordReg = undefined;

var _joi = __webpack_require__(9);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passwordReg = exports.passwordReg = /(?=.*)(?=.*[a-z])(?=.*[A-Z].{6,})/;
exports.default = {
    signup: {
        body: {
            email: _joi2.default.string().email().required(),
            password: _joi2.default.string().regex(passwordReg).required(),
            firstName: _joi2.default.string().required(),
            lastName: _joi2.default.string().required(),
            userName: _joi2.default.string().required()
        }
    }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.authJwt = exports.authLocal = undefined;

var _passport = __webpack_require__(11);

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = __webpack_require__(28);

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _passportJwt = __webpack_require__(27);

var _user = __webpack_require__(2);

var _user2 = _interopRequireDefault(_user);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Local strategy
const localOpts = {
    usernameField: 'email'
};
const localStrategy = new _passportLocal2.default(localOpts, async (email, password, done) => {
    try {
        const user = await _user2.default.findOne({ email });
        if (!user) {
            return done(null, false);
        } else if (!user.authenticateUser(password)) {
            return done(null, false);
        }

        return done(null, user);
    } catch (e) {
        return done(e, false);
    }
});

//Jwt strategy
const jwtOpts = {
    jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeader('authorization'),
    secretOrKey: _constants2.default.JWT_SECRET
};
const jwtStrategy = new _passportJwt.Strategy(jwtOpts, async (payload, done) => {
    try {
        const user = await _user2.default.findById(payload._id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (e) {
        return done(e, false);
    }
});

_passport2.default.use(localStrategy);
_passport2.default.use(jwtStrategy);

const authLocal = exports.authLocal = _passport2.default.authenticate('local', { session: false });
const authJwt = exports.authJwt = _passport2.default.authenticate('jwt', { session: false });

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("express-validation");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("http-status");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("joi");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("mongoose-unique-validator");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mongoose = __webpack_require__(3);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Remove the warning with Promise
_mongoose2.default.Promise = global.Promise;

//Connect the db with the url provide
try {
    _mongoose2.default.connect(_constants2.default.MONGO_URL);
} catch (err) {
    _mongoose2.default.createConnection(_constants2.default.MONGO_URL);
}

_mongoose2.default.connection.once('open', () => console.log('MongoDB running')).on('error', e => {
    throw e;
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _morgan = __webpack_require__(26);

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = __webpack_require__(22);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _compression = __webpack_require__(23);

var _compression2 = _interopRequireDefault(_compression);

var _helmet = __webpack_require__(24);

var _helmet2 = _interopRequireDefault(_helmet);

var _passport = __webpack_require__(11);

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

exports.default = app => {
    if (isProd) {
        app.use((0, _compression2.default)());
        app.use((0, _helmet2.default)());
    }

    app.use(_bodyParser2.default.json());
    app.use(_bodyParser2.default.urlencoded({ extended: true }));
    app.use(_passport2.default.initialize());

    if (isDev) {
        app.use((0, _morgan2.default)('dev'));
    }
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = __webpack_require__(20);

var _user2 = _interopRequireDefault(_user);

var _post = __webpack_require__(17);

var _post2 = _interopRequireDefault(_post);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = app => {
    app.use('/api/v1/users', _user2.default);
    app.use('/api/v1/posts', _post2.default);
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _constants = __webpack_require__(0);

var _constants2 = _interopRequireDefault(_constants);

__webpack_require__(12);

var _middlewares = __webpack_require__(13);

var _middlewares2 = _interopRequireDefault(_middlewares);

var _modules = __webpack_require__(14);

var _modules2 = _interopRequireDefault(_modules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_constants2.default);

const app = (0, _express2.default)();
(0, _middlewares2.default)(app);

app.get('/', (req, res) => {
    res.send('Hello world =)');
});

(0, _modules2.default)(app);

app.listen(_constants2.default.PORT, err => {
    if (err) {
        throw err;
    } else {
        console.log(`
        Server running on port: ${_constants2.default.PORT}
        Running on ${process.env.NODE_ENV}
        Make something...
        `);
    }
});

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createPost = createPost;
exports.getPostById = getPostById;
exports.getPostsList = getPostsList;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.favoritePost = favoritePost;

var _httpStatus = __webpack_require__(8);

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _post = __webpack_require__(4);

var _post2 = _interopRequireDefault(_post);

var _user = __webpack_require__(2);

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function createPost(req, res) {
    try {
        const post = await _post2.default.createPost(req.body, req.user._id);
        return res.status(_httpStatus2.default.CREATED).json(post);
    } catch (e) {
        return res.status(_httpStatus2.default.BAD_REQUEST).json(e);
    }
}
async function getPostById(req, res) {
    try {
        const promise = await Promise.all([_user2.default.findById(req.user._id), _post2.default.findById(req.params.id).populate('user')]);
        const favorite = promise[0]._favorites.isPostIsFavorite(req.params.id);
        const post = promise[1];
        return res.status(_httpStatus2.default.OK).json(Object.assign({}, post.toJSON(), {
            favorite
        }));
    } catch (e) {
        return res.status(_httpStatus2.default.BAD_REQUEST).json(e);
    }
}

async function getPostsList(req, res) {
    const limit = parseInt(req.query.limit, 0);
    const skip = parseInt(req.query.skip, 0);
    try {
        const promise = await Promise.all([_user2.default.findById(req.user._id), _post2.default.list({ limit, skip })]);
        const posts = promise[1].reduce((arr, post) => {
            const favorite = promise[0]._favorites.isPostIsFavorite(post._id);
            arr.push(Object.assign({}, post.toJSON(), {
                favorite
            }));
            return arr;
        }, []);
        return res.status(_httpStatus2.default.OK).json(posts);
    } catch (e) {
        return res.status(_httpStatus2.default.BAD_REQUEST).json(e);
    }
}
async function updatePost(req, res) {
    try {
        const post = await _post2.default.findById(req.params.id);
        if (!post.user.equals(req.user._id)) {
            return res.sendStatus(_httpStatus2.default.UNAUTHORIZED);
        }
        Object.keys(req.body).forEach(key => {
            post[key] = req.body[key];
        });
        return res.status(_httpStatus2.default.OK).json((await post.save()));
    } catch (e) {
        return res.status(_httpStatus2.default.BAD_REQUEST).json(e);
    }
}
async function deletePost(req, res) {
    try {
        const post = await _post2.default.findById(req.params.id);
        if (!post.user.equals(req.user._id)) {
            return res.sendStatus(_httpStatus2.default.UNAUTHORIZED);
        }
        await post.remove();
        return res.sendStatus(_httpStatus2.default.OK);
    } catch (e) {
        return res.status(_httpStatus2.default.BAD_REQUEST).json(e);
    }
}
async function favoritePost(req, res) {
    try {
        const user = await _user2.default.findById(req.user._id);
        await user._favorites.posts(req.params.id);
        return res.sendStatus(_httpStatus2.default.OK);
    } catch (e) {
        return res.status(_httpStatus2.default.BAD_REQUEST).json(e);
    }
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = __webpack_require__(1);

var _expressValidation = __webpack_require__(7);

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _post = __webpack_require__(16);

var postController = _interopRequireWildcard(_post);

var _auth = __webpack_require__(6);

var _post2 = __webpack_require__(18);

var _post3 = _interopRequireDefault(_post2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();

routes.post('/', _auth.authJwt, (0, _expressValidation2.default)(_post3.default.createPost), postController.createPost);
routes.get('/:id', _auth.authJwt, postController.getPostById);
routes.get('/', _auth.authJwt, postController.getPostsList);
routes.patch('/:id', _auth.authJwt, (0, _expressValidation2.default)(_post3.default.updatePost), postController.updatePost);
routes.delete('/:id', _auth.authJwt, postController.deletePost);
//Favorites
routes.post('/:id/favorite', _auth.authJwt, postController.favoritePost);

exports.default = routes;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _joi = __webpack_require__(9);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    createPost: {
        body: {
            title: _joi2.default.string().min(3).required(),
            text: _joi2.default.string().min(10).required()
        }
    },
    updatePost: {
        body: {
            title: _joi2.default.string().min(3),
            text: _joi2.default.string().min(10)
        }
    }
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.signUp = signUp;
exports.login = login;

var _httpStatus = __webpack_require__(8);

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _user = __webpack_require__(2);

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function signUp(req, res) {
    try {
        const user = await _user2.default.create(req.body);
        return res.status(_httpStatus2.default.CREATED).json(user.toAuthJSON());
    } catch (e) {
        return res.status(_httpStatus2.default.BAD_REQUEST).json(e);
    }
}
function login(req, res, next) {
    res.status(_httpStatus2.default.OK).json(req.user.toAuthJSON());
    return next();
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(1);

var _expressValidation = __webpack_require__(7);

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _auth = __webpack_require__(6);

var _user = __webpack_require__(19);

var userController = _interopRequireWildcard(_user);

var _user2 = __webpack_require__(5);

var _user3 = _interopRequireDefault(_user2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.Router();
routes.post('/signUp', (0, _expressValidation2.default)(_user3.default.signup), userController.signUp);
routes.post('/login', _auth.authLocal, userController.login);

exports.default = routes;

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("bcrypt-nodejs");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("helmet");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("passport-jwt");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("slug");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("validator");

/***/ })
/******/ ]);