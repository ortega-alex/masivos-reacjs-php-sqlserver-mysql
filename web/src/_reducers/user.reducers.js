import { UserConstants } from '../_constants/index';
import Fuctions from '../_hepers/Fuctions';

export default function _users(state = {}, action) {
    switch (action.type) {
        case UserConstants.REQUEST:
            return {
                ...state
            };
        case UserConstants.FAILURE:
            Fuctions.message("error", action.err.toString());
            return {
                ...state
            };
        case UserConstants.SUCCESS:
            Fuctions.message(action.tipo, action.msj.toString());
            return {
                ...state,
                usuario: action.usuario
            };      
        default:
            return state
    }
}