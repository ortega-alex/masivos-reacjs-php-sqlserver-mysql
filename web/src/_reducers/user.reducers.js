import { UserConstants } from '../_constants/index';
import Functions from '../_helpers/Functions';

export default function _users(state = {}, action) {
    switch (action.type) {
        case UserConstants.REQUEST:
            return {
                ...state
            };
        case UserConstants.FAILURE:
            Functions.message("error", action.err.toString());
            return {
                ...state
            };
        case UserConstants.SUCCESS:
            Functions.message(action.tipo, action.msj.toString());
            return {
                ...state,
                usuario: action.usuario
            };
        default:
            return state
    }
}