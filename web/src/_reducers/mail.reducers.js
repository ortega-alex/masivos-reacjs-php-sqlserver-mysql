import { MailConstants } from '../_constants/index';
import Fuctions from '../_hepers/Fuctions';

export default function _mails(state = {}, action) {
    switch (action.type) {
        case MailConstants.REQUEST_MAIL:
            return {
                ...state
            };
        case MailConstants.FAILURE_MAIL:
            Fuctions.message("error", action.err.toString());
            return {
                ...state
            };
        case MailConstants.SUCCESS_MAIL:
            Fuctions.message(action.tipo, action.msj.toString());
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
                lote: action.lote
            };
        default:
            return state
    }
}