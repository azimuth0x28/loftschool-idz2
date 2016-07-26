var logger = require('../../../utils/winston')(module);
var HttpError = require('../../../middleware/HttpError').HttpError;
var ObjectID = require('mongodb').ObjectID;
var async = require('async');
var isEmpty = require('../../../utils/helpers/isEmpty');
var User = require('../../../db/models/User').mUser;


/**
 *
 * @param req
 * @param res
 * @param next
 * @constructor
 */
var API_getUsersList = function (req, res, next) {
  // TODO: API- Список пользователей отдватаь по токену !
  User
  .find({}, '_id, userdata')
  .lean()
  .exec(function (err, users) {
    if (err) return next(err);
    next(new HttpError(200, null, '', users));
  });
};


/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 * @constructor
 */
var API_getUserById = function (req, res, next) {
  var user_id = req.query.user_id || req.params.user_id || req.body.user_id || req.user._id;

  if (user_id === undefined) {
    return next(new HttpError(400, null, 'Неверно указан идентификатор пользователя!'));
  }

  try {
    var uid = new ObjectID(user_id);
  }
  catch (e) {
    return next(new HttpError(400, null, 'Неверно указан идентификатор пользователя!'));
  }

  User
  .findById(uid, '_id, userdata')
  .lean()
  .exec(function (err, user) {
    if (err) return next(err);
    next(new HttpError(200, null, '', [user]));
  });
};


/**
 *
 * @param req
 * @param res
 * @param next
 */
var API_addUser = function (req, res, next) {
  //TODO: API- Сделать регисрацию пользователя по API
  var result = {};
  next(new HttpError(200, null, '', result));
};


/**
 *
 * @param req
 * @param res
 * @param next
 */
var API_updateUserBg = function (req, res, next) {
  var user_id = req.query.user_id || req.params.user_id || req.body.user_id || req.user._id;

  var newData = {};

  var avatar = req.query.avatar || req.params.avatar || req.body.avatar || feq.files['avatar'];
  var bg_img = req.query.bg_img || req.params.bg_img || req.body.bg_img || feq.files['bg_img'];


  if (user_id === undefined) {
    return next(new HttpError(400, null, 'Неверно указан идентификатор пользователя!'));
  }

  try {
    var uid = new ObjectID(user_id);
  }
  catch (e) {
    return next(new HttpError(400, null, 'Неверно указан идентификатор пользователя!'));
  }


  //TODO: API- Сделать обновление пользователя по API
  var result = {};
  next(new HttpError(200, null, '', result));
};


/**
 *
 * @param req
 * @param res
 * @param next
 */
var API_updateUserAva = function (req, res, next) {
  var user_id = req.query.user_id || req.params.user_id || req.body.user_id || req.user._id;

  var newData = {};

  var avatar = req.query.avatar || req.params.avatar || req.body.avatar || feq.files['avatar'];
  var bg_img = req.query.bg_img || req.params.bg_img || req.body.bg_img || feq.files['bg_img'];


  if (user_id === undefined) {
    return next(new HttpError(400, null, 'Неверно указан идентификатор пользователя!'));
  }

  try {
    var uid = new ObjectID(user_id);
  }
  catch (e) {
    return next(new HttpError(400, null, 'Неверно указан идентификатор пользователя!'));
  }


  //TODO: API- Сделать обновление пользователя по API
  var result = {};
  next(new HttpError(200, null, '', result));
};


/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 * @constructor
 */
var API_updateUserProfile = function (req, res, next) {
  var user_id = req.query.user_id || req.params.user_id || req.body.user_id || req.user._id;

  var newData = {};

  var firstName = req.query.firstName || req.params.firstName || req.body.firstName;
  var lastName = req.query.lastName || req.params.lastName || req.body.lastName;
  var lastName = req.query.lastName || req.params.lastName || req.body.lastName;
  
  var emailAddress = req.query.emailAddress || req.params.emailAddress || req.body.emailAddress;
  var gl = req.query.gl || req.params.gl || req.body.gl;
  var tw = req.query.tw || req.params.tw || req.body.tw;
  var fb = req.query.fb || req.params.fb || req.body.fb;
  var vk = req.query.vk || req.params.vk || req.body.vk;


  if (firstName) newData.firstName = firstName.trim();
  if (lastName) newData.lastName = lastName.trim();

  if (emailAddress || gl || tw || fb || vk) newData.userdata = {};

  if (emailAddress) newData.userdata.emailAddress = emailAddress.trim();
  if (gl) newData.userdata.gl = gl.trim();
  if (tw) newData.userdata.tw = tw.trim();
  if (fb) newData.userdata.fb = fb.trim();
  if (vk) newData.userdata.vk = vk.trim();

  console.log(newData);
  if (isEmpty(newData)) {
    return next(new HttpError(400, null, 'Не заданы новые значения для полей профиля.'));
  }

  if (user_id === undefined) {
    return next(new HttpError(400, null, 'Неверно указан идентификатор пользователя!'));
  }

  try {
    var uid = new ObjectID(user_id);
  }
  catch (e) {
    return next(new HttpError(400, null, 'Неверно указан идентификатор пользователя!'));
  }
  // Обновляем Социалки пользователя

  async.waterfall([
        //Ищем пользователя и проверяем что он сущ-ет и это мы сами
        function (done) {
          User.findById(uid).exec(function (err, user) {
            if (err) return next(err);

            if (!user) {
              return next(new HttpError(400, null, 'ID пользователя указан не верно либо пользователь не существует'));
            }

            if (user._id.toString() !== req.user._id.toString()) {
              return next(new HttpError(400, null, 'Вы можете редактировать только свои данные!'));
            }

            return done(null, user);
          });
        },
        // обновляем данные в БД
        function (user, done) {
          User.update({_id: user._id}, {$set: newData}, {runValidators: true}, function (err, raw) {
            if (err) {//-> если в процессе регистрации была Ошибка, обрабатываем ее.
              logger.debug("Ошибка ", err.name);
              if (err.name === 'ValidationError') {//-> Это наша ошибка Валидации данных из Mongoose
                var errMsgList = [];

                if (err.errors['userdata.emailAddress']) {
                  logger.info("Ошибка валидации Email пользователя. %s", err.errors['userdata.emailAddress'].message);
                  errMsgList.push(err.errors['userdata.emailAddress'].message);
                }

                return errMsgList.length ?
                    done(new HttpError(400, 'ILLEGAL_PARAM_VALUE', errMsgList)) :
                    done(new HttpError(500));
              }
              else {//-> Это ошибка не нами сгенерена и не результат Валидации Mongoose, отдаем ее express
                return done(err);
              }
            }

            return done(null, user);
          });
        },
        // формируем объект для ответа о статусе
        function (user, done) {
          User
          .findById(user._id, '_id, userdata')
          .lean()
          .exec(function (err, user) {
            if (err) return next(err);
            return done(null, user);
          });
        }
      ],
      //Отдаем результаты
      function (err, result) {
        if (err) return next(err);
        next(new HttpError(200, null, 'Данные успешно обновлены', [result]));
      });


};


/**
 *
 * @param req
 * @param res
 * @param next
 */
var API_deleteUser = function (req, res, next) {
  //TODO: API- Сделать удаление пользователя по API
  var result = {};
  next(new HttpError(200, null, '', result));
};


exports = module.exports = {
  API_getUsersList:      API_getUsersList,
  API_getUserById:       API_getUserById,
  API_addUser:           API_addUser,
  API_updateUserAva:     API_updateUserAva,
  API_updateUserBg:      API_updateUserBg,
  API_updateUserProfile: API_updateUserProfile,
  API_deleteUser:        API_deleteUser
};

