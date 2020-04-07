import { message as Message } from 'antd';
import { AsyncStorage } from 'AsyncStorage';

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('es');

function removeTildes(val) {
    return val.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function replaceSpaces(val) {
    return val.replace(/ /g, '_');
}

function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}

function message(typo, menssage) {
    Message.config({
        top: 50,
        duration: 5
    });
    Message[typo](menssage);
}

function orderByAsc(arr) {
    arr.sort(function (a, b) { return a - b; });
    return arr;
}

function itHasLetters(texto) {
    var letras = "abcdefghyjklmnñopqrstuvwxyz";
    texto = texto.toLowerCase();
    for (var i = 0; i < texto.length; i++) {
        if (letras.indexOf(texto.charAt(i), 0) !== -1) {
            return true;
        }
    }
    return false;
}

function multiple(valor, multiple) {
    var resto = valor % multiple;
    if (resto == 0)
        return true;
    else
        return false;
}

async function validateSession() {
    await AsyncStorage.getItem('login_masivo', (err, res) => {
        if (!err && res && res != "undefined") {
            var usuario = JSON.parse(res);
            var actual = moment();
            if (usuario.fecha && actual.diff(usuario.fecha, 'hours') >= 8) {
                AsyncStorage.setItem('login_tickets', undefined).then(() => {
                    window.location.reload(true);
                });
            }
        }
    });
}

function validEmail(text) {
    var reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
    return reg.test(text);
}

export default  {
    removeTildes,
    replaceSpaces,
    commaSeparateNumber,
    message,
    orderByAsc,
    itHasLetters,
    multiple,
    validateSession,
    validEmail
};