import { MailConstants } from '../_constants/index';
import Functions from '../_helpers/Functions';

export default function _mails(state = {}, action) {
    switch (action.type) {
        case MailConstants.REQUEST_MAIL:
            if (action._disabled != undefined) {
                return {
                    ...state,
                    _disabled: action._disabled
                };
            } else {
                return {
                    ...state
                };
            }
        case MailConstants.FAILURE_MAIL:
            Functions.message("error", action.err.toString());
            return {
                ...state,
                _disabled: false
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
        case MailConstants.GET_NOTIFICATIONS_THREAD:
            return {
                ...state,
                notifications_thread: action.notifications_thread,
                notification: action.notification
            };
        case MailConstants.GET_THREADS:
            return {
                ...state,
                threads: action.threads
            };
        // case MailConstants.OPEN_OR_CLOSE_PANEL:
        //     return {
        //         ...state,
        //         modal_panel: action.modal_panel
        //     };
        default:
            return state
    }
}