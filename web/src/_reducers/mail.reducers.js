import { MailConstants } from '../_constants/index';
import Functions from '../_hepers/Functions';

export default function _mails(state = {}, action) {
    switch (action.type) {
        case MailConstants.REQUEST_MAIL:
            return {
                ...state,
                notification: action.notification
            };
        case MailConstants.FAILURE_MAIL:
            Functions.message("error", action.err.toString());
            return {
                ...state
            };
        case MailConstants.SUCCESS_MAIL:
            Functions.message(action.tipo, action.msj.toString());
            return {
                ...state
            };
        case MailConstants.GET_MAIL:
            return {
                ...state,
                mails: action.mails
            };
        case MailConstants.GET_LOT:
            return {
                ...state,
                lote: action.data.lote,
                thread: action.data.thread
            };
        case MailConstants.GET_THREADS:
            return {
                ...state,
                threads: action.threads
            };
        default:
            return state
    }
}