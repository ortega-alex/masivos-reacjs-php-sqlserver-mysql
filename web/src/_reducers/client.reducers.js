import { ClientConstants } from '../_constants/index';
import Functions from '../_helpers/Functions';

export default function _clients(state = {}, action) {
    switch (action.type) {
        case ClientConstants.REQUEST_CLIENT:
            return {
                ...state
            };
        case ClientConstants.FAILURE_CLIENT:
            Functions.message("error", action.err.toString());
            return {
                ...state
            };
        case ClientConstants.SUCCESS_CLIENT:
            Functions.message(action.tipo, action.msj.toString());
            return {
                ...state
            };
        case ClientConstants.GET_CLIENTS:
            return {
                ...state,
                clientes: action.clientes
            };
        case ClientConstants.GET_CLIENTS_OPERATION:
            return {
                ...state,
                clientes_operacion: action.clientes_operacion
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
        case ClientConstants.GET_OPERATION:
            return {
                ...state,
                operaciones: action.operaciones
            };
        case ClientConstants.GET_PRODUCTS_OPERATION:
            return {
                ...state,
                productos_operacion: action.productos_operacion
            };
        default:
            return state
    }
}