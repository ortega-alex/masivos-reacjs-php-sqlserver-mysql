import { ClientConstants } from '../_constants/index';
import http from '../_services/http.services';

function request() { return { type: ClientConstants.REQUEST_CLIENT } }
function failure(err) { return { type: ClientConstants.FAILURE_CLIENT, err } }
function getActSucess(clientes_activos) { return { type: ClientConstants.GET_CLIENT_ACT, clientes_activos } }
function getProductoClienteSucess(productos_cliente) { return { type: ClientConstants.GET_PRODUC_CLIENT, productos_cliente } }
function getTextoClienteSuccess(textos_cliente) { return { type: ClientConstants.GET_TEXT_CLIENT, textos_cliente } }

function getActivos() {
    return dispatch => {
        dispatch(request());
        http._GET("client/client.php?get_activos=true").then(res => {
            dispatch(getActSucess(res.clientes_activos));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function getProductoCliente(data) {
    return dispatch => {
        dispatch(request());
        http._POST("client/client.php?get_productos_cliente=true", data).then(res => {
            dispatch(getProductoClienteSucess(res.productos_cliente));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function getTextoCliente(data) {
    return dispatch => {
        dispatch(request());
        http._POST("client/client.php?get_textos_cliente=true", data).then(res => {
            dispatch(getTextoClienteSuccess(res.textos_cliente));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

export default {
    getActivos,
    getProductoCliente,
    getTextoCliente
};