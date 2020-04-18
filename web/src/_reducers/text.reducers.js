import { TextConstants } from '../_constants/index';
import Functions from '../_helpers/Functions';

export default function _texts(state = {}, action) {
    switch (action.type) {
        case TextConstants.REQUEST_TEXT:
            return {
                ...state
            };
        case TextConstants.FAILURE_TEXT:
            Functions.message("error", action.err.toString());
            return {
                ...state
            };
        case TextConstants.SUCCESS_TEXT:
            Functions.message(action.tipo, action.msj.toString());
            return {
                ...state
            };
        case TextConstants.GET_TEXT_CLIENT:
            return {
                ...state,
                textos_cliente: action.textos_cliente
            };
        case TextConstants.GET_TEXTS:
            return {
                ...state,
                textos: action.textos
            };
        case TextConstants.GET_IMAGES:
            return {
                ...state,
                images: action.images
            };
        case TextConstants.GET_IMAGES_ACT:
            return {
                ...state,
                images_activas: action.images_activas
            };
        default:
            return state
    }
}