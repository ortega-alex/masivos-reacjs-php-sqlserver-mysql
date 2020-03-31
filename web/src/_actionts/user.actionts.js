import { AsyncStorage } from 'AsyncStorage';
import { UserConstants } from '../_constants/index';

import http from '../_services/http.services';

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('es');

function request() { return { type: UserConstants.REQUEST } }
function failure(err) { return { type: UserConstants.FAILURE, err } }
function success(tipo, msj, user = {}) { return { type: UserConstants.SUCCESS, tipo, msj, user } }

function login(data) {
    return dispatch => {
        dispatch(request());
        http._POST("user/user.php?login=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success("warning", res.msj));
            } else {
                res.user.fecha = moment();
                AsyncStorage.setItem('login_massive', JSON.stringify(res.user)).then(() => {
                    window.location.reload(true);
                });
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        })
    }
}

function changePass(data) {
    return dispatch => {
        dispatch(request());
        http._POST("user/user.php?change_pass=true", data).then(res => {
            if (res.err == 'true') {
                dispatch(success("warning", res.msj));
            } else {
                dispatch(success("success", res.msj));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function logout() {
    AsyncStorage.setItem('login_massive', undefined).then(() => {
        window.location.reload();
    });
    return { type: UserConstants.LOGIN, tipo: 'success', mjs: 'Se cerro la session exitosamente', user: {} };
}

export default {
    login,
    changePass,
    logout
};