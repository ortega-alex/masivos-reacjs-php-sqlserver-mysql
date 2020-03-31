import { MailConstants } from '../_constants/index';
import http from '../_services/http.services';

function request() { return { type: MailConstants.REQUEST_MAIL } }
function failure(err) { return { type: MailConstants.FAILURE_MAIL, err } }
function success(tipo, msj) { return { type: MailConstants.SUCCESS, tipo, msj } }
function getSucess(mails) { return { type: MailConstants.GET_MAIL, mails } }

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

export default {
    get
};