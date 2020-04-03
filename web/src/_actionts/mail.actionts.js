import { MailConstants } from '../_constants/index';
import http from '../_services/http.services';
import { AsyncStorage } from 'AsyncStorage';

function request(notification = false) { return { type: MailConstants.REQUEST_MAIL, notification } }
function failure(err) { return { type: MailConstants.FAILURE_MAIL, err } }
function getSucess(mails) { return { type: MailConstants.GET_MAIL, mails } }
function getLotSucess(data) { return { type: MailConstants.GET_LOT, data } }
function getThreadsSuccess(threads) { return { type: MailConstants.GET_THREADS, threads } }

function get(data) {
    return dispatch => {
        dispatch(request());
        http._POST("mail/mail.php?get=true", data).then(res => {
            dispatch(getSucess(res.mails));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function getLote(data) {
    return dispatch => {
        dispatch(request(true));
        http._POST("mail/mail.php?lot=true", data).then(res => {
            AsyncStorage.setItem(res.thread.id_thread.toString(), JSON.stringify(res)).then(() => {
                dispatch(sendLot(res.thread.id_thread));
            });
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function sendLot(id_thread) {
    return dispatch => {
        AsyncStorage.getItem(id_thread.toString(), (err, res) => {
            if (!err && res && res != 'undefined') {
                var data = JSON.parse(res);
                if (data.thread.send < data.thread.length) {
                    var _data = {
                        thread: JSON.stringify(data.thread),
                        lote: JSON.stringify(data.lote[data.thread.send])
                    }
                    dispatch(getLotSucess(data));
                    dispatch(send(_data));
                } else {
                    AsyncStorage.setItem(data.thread.id_thread.toString()).then(() => {
                        dispatch(getLotSucess(data));
                    });
                }
            } else {
                dispatch(getLotSucess(data));
            }
        });
    }
}

function send(data) {
    return dispatch => {
        http._POST("mail/mail.php?send=true", data).then(res => {
            AsyncStorage.getItem(res.thread.id_thread.toString(), (err, _res) => {
                var data = JSON.parse(_res);
                data.thread = res.thread;
                AsyncStorage.setItem(res.thread.id_thread.toString(), JSON.stringify(data)).then(() => {
                    dispatch(sendLot(res.thread.id_thread));
                });
            });
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}


function getThreads(data) {
    return dispatch => {
        dispatch(request());
        http._POST("mail/mail.php?get_threads=true", data).then(res => {
            dispatch(getThreadsSuccess(res.threads));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

export default {
    get,
    getLote,
    getThreads
};