import { ClientConstants } from '../_constants/index';
import Fuctions from '../_hepers/Fuctions';

export default function _clients(state = {}, action) {
    switch (action.type) {
        case ClientConstants.REQUEST_CLIENT:
            return {
                ...state
            };
        case ClientConstants.FAILURE_CLIENT:
            Fuctions.message("error", action.err.toString());
            return {
                ...state
            };
        case ClientConstants.SUCCESS_CLIENT:
            Fuctions.message(action.tipo, action.msj.toString());
            return {
                ...state
            };
        case ClientConstants.GET_CLIENT_ACT:
            return {
                ...state,
                clientes_activos: action.clientes_activos
            };
        case ClientConstants.GET_PRODUC_CLIENT:
            return {
                ...state,
                productos_cliente: action.productos_cliente
            };
        case ClientConstants.GET_TEXT_CLIENT:
            return {
                ...state,
                textos_cliente: action.textos_cliente
            };
        default:
            return state
    }
}