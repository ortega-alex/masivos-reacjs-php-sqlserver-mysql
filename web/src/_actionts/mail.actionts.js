import { MailConstants } from '../_constants/index';
import http from '../_services/http.services';
import { AsyncStorage } from 'AsyncStorage';

function request() { return { type: MailConstants.REQUEST_MAIL } }
function failure(err) { return { type: MailConstants.FAILURE_MAIL, err } }
function getSucess(mails) { return { type: MailConstants.GET_MAIL, mails } }
function getNotificationsThreadSuccess(notifications_thread, notification) { return { type: MailConstants.GET_NOTIFICATIONS_THREAD, notifications_thread, notification } }
function getThreadsSuccess(threads) { return { type: MailConstants.GET_THREADS, threads } }
function openOrClosePanelSuccess(modal_panel) { return { type: MailConstants.OPEN_OR_CLOSE_PANEL, modal_panel } }

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
        dispatch(request());
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
                    dispatch(setNotificationThread(data.thread));
                    dispatch(send(_data));
                } else {
                    AsyncStorage.setItem(data.thread.id_thread.toString()).then(() => {
                        dispatch(setNotificationThread(data.thread));
                    });
                }
            } else {
                dispatch(setNotificationThread(data.thread));
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

function OpenOrClosePanel(modal_panel, id_usuario = null) {
    return dispatch => {
        if ( modal_panel == true ) {
            dispatch(getThreads({id_usuario}));
        }
        dispatch(openOrClosePanelSuccess(modal_panel));
    } 
}

export default {
    get,
    getLote,
    getThreads,
    removeNotificationThread,
    OpenOrClosePanel
};