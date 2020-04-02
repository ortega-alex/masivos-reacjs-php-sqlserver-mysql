import { MailConstants } from '../_constants/index';
import http from '../_services/http.services';

function request() { return { type: MailConstants.REQUEST_MAIL } }
function failure(err) { return { type: MailConstants.FAILURE_MAIL, err } }
function getSucess(mails) { return { type: MailConstants.GET_MAIL, mails } }
function getLotSucess(lote) { return { type: MailConstants.GET_LOT, lote } }

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
            dispatch(getLotSucess(res.lote));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

export default {
    get,
    getLote
};