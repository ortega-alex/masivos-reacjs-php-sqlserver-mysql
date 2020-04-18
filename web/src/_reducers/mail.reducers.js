import { MailConstants } from '../_constants/index';
import Functions from '../_helpers/Functions';

export default function _mails(state = {}, action) {
    switch (action.type) {
        case MailConstants.REQUEST_MAIL:
            if (action._disabled != undefined) {
                return {
                    ...state,
                    _disabled: action._disabled,
                    _loading: action._loading
                };
            } else {
                return {
                    ...state,
                    _loading: action._loading
                };
            }
        case MailConstants.FAILURE_MAIL:
            Functions.message("error", action.err.toString());
            return {
                ...state,
                _disabled: false,
                _loading: false
            };
        case MailConstants.SUCCESS_MAIL:
            Functions.message(action.tipo, action.msj.toString());
            return {
                ...state
            };
        case MailConstants.GET_MAIL:
            return {
                ...state,
                _loading: false,
                mails: action.mails
            };
        case MailConstants.GET_NOTIFICATIONS_THREAD:
            return {
                ...state,
                notifications_thread: action.notifications_thread,
                notification: action.notification
            };
        case MailConstants.GET_THREADS:
            return {
                ...state,
                _loading: false,
                threads: action.threads
            };
        case MailConstants.GET_ESTADOS_ACT:
            return {
                ...state,
                estados_act: action.estados_act
            };
        default:
            return state
    }
}