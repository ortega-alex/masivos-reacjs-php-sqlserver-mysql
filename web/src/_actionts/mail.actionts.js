import { MailConstants } from '../_constants/index';
import http from '../_services/http.services';
import { AsyncStorage } from 'AsyncStorage';

function request( _loading = false, _disabled = undefined) {
    if (_disabled != undefined) {
        return { type: MailConstants.REQUEST_MAIL, _loading, _disabled }
    } else {
        return { type: MailConstants.REQUEST_MAIL, _loading }
    }
}
function failure(err) { return { type: MailConstants.FAILURE_MAIL, err } }
function succes(msj, tipo) { return { type: MailConstants.SUCCESS_MAIL, msj, tipo } }
function getSucess(mails) { return { type: MailConstants.GET_MAIL, mails } }
function getNotificationsThreadSuccess(notifications_thread, notification) { return { type: MailConstants.GET_NOTIFICATIONS_THREAD, notifications_thread, notification } }
function getThreadsSuccess(threads) { return { type: MailConstants.GET_THREADS, threads } }
function getEstadosActSuccess(estados_act) { return { type: MailConstants.GET_ESTADOS_ACT, estados_act } }

function get(data) {
    return dispatch => {
        dispatch(request(true));
        http._POST("mail/mail.php?get=true", data).then(res => {
            dispatch(getSucess(res.mails));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function addLot(data) {
    return dispatch => {
        dispatch(request(false, true));
        http._POST("mail/mail.php?add_lot=true", data).then(res => {
            AsyncStorage.setItem(res.thread.id_thread, JSON.stringify(res)).then(() => {
                dispatch(request(false, false));
                dispatch(getThreads(data));
                dispatch(sendLot(res.thread));
            });
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function sendLot(thread) {
    return dispatch => {
        AsyncStorage.getItem(thread.id_thread, (err, res) => {
            if (!err && res && res != 'undefined') {
                var data = JSON.parse(res);
                if (data.thread.send < data.thread.length) {
                    var _data = {
                        thread: JSON.stringify(data.thread),
                        lote: JSON.stringify(data.lote[data.thread.send])
                    }
                    dispatch(setNotificationThread(data.thread));
                    dispatch(getThreads(data));
                    dispatch(send(_data));
                } else {
                    AsyncStorage.setItem(data.thread.id_thread.toString()).then(() => {
                        dispatch(setNotificationThread(data.thread));
                        dispatch(getThreads(data));
                    });
                }
            } else {
                dispatch(addLot(thread));
            }
        });
    }
}

function send(data) {
    return dispatch => {
        http._POST("mail/mail.php?send=true", data).then(res => {
            if (res.pausar == 'false') {
                AsyncStorage.getItem(res.thread.id_thread, (err, _res) => {
                    var data = JSON.parse(_res);
                    data.thread = res.thread;
                    AsyncStorage.setItem(res.thread.id_thread, JSON.stringify(data)).then(() => {
                        dispatch(sendLot(res.thread));
                    });
                });
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function getThreads(data) {
    return dispatch => {
        dispatch(request(true, false));
        http._POST("mail/mail.php?get_threads=true", data).then(res => {
            dispatch(getThreadsSuccess(res.threads));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function setNotificationThread(thread) {
    return dispatch => {
        AsyncStorage.getItem("notifications_thread", (err, _res) => {
            if (!err && _res && _res != 'undefined') {
                var notifications_thread = JSON.parse(_res);
                notifications_thread[thread.id_thread] = thread;
                AsyncStorage.setItem("notifications_thread", JSON.stringify(notifications_thread)).then(() => {
                    dispatch(getNotificationsThreadSuccess(notifications_thread, true));
                });
            } else {
                var notifications_thread = {};
                notifications_thread[thread.id_thread] = thread;
                AsyncStorage.setItem("notifications_thread", JSON.stringify(notifications_thread)).then(() => {
                    dispatch(getNotificationsThreadSuccess(notifications_thread, true));
                });
            }
        });
    }
}

function removeNotificationThread(id_thread) {
    return dispatch => {
        AsyncStorage.getItem("notifications_thread", (err, _res) => {
            var notifications_thread = JSON.parse(_res);
            delete notifications_thread[id_thread];
            AsyncStorage.setItem('notifications_thread', JSON.stringify(notifications_thread)).then(() => {
                var notification = true;
                if (Object.keys(notifications_thread).length <= 0) {
                    notification = false;
                }
                dispatch(getNotificationsThreadSuccess(notifications_thread, notification));
            });
        });
    }
}


function changeStatusThread(data) {
    return dispatch => {
        http._POST("mail/mail.php?change_status_thread=true", data).then(res => {
            if (data.status == 0) {
                dispatch(sendLot(data));
            }
            if (res.err == 'false') {
                dispatch(succes(res.msj, 'success'));
                dispatch(getThreads(data));
            } else {
                dispatch(succes(res.msj, 'error'));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function getEstadosAct(data) {
    return dispatch => {
        dispatch(request());
        http._POST("mail/mail.php?get_management_status_act=true", data).then(res => {
            dispatch(getEstadosActSuccess(res.estados_act));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

export default {
    get,
    addLot,
    getThreads,
    removeNotificationThread,
    changeStatusThread,
    getEstadosAct
};