import { ClientConstants } from '../_constants/index';
import http from '../_services/http.services';

function request() { return { type: ClientConstants.REQUEST_CLIENT } }
function failure(err) { return { type: ClientConstants.FAILURE_CLIENT, err } }
function succes(msj, tipo) { return { type: ClientConstants.SUCCESS_CLIENT, msj, tipo } }
function getSucess(clientes) { return { type: ClientConstants.GET_CLIENTS, clientes } }
function getClientOperationSucess(clientes_operacion) { return { type: ClientConstants.GET_CLIENTS_OPERATION, clientes_operacion } }
function getActSucess(clientes_activos) { return { type: ClientConstants.GET_CLIENT_ACT, clientes_activos } }
function getProductoClienteSucess(productos_cliente) { return { type: ClientConstants.GET_PRODUC_CLIENT, productos_cliente } }
function getOperationSuccess(operaciones) { return { type: ClientConstants.GET_OPERATION, operaciones } }
function getProductOperationSucess(productos_operacion) { return { type: ClientConstants.GET_PRODUCTS_OPERATION, productos_operacion } }

function get() {
    return dispatch => {
        dispatch(request());
        http._GET("client/client.php?get=true").then(res => {
            dispatch(getSucess(res.clientes));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function getClientOperation(data) {
    return dispatch => {
        dispatch(request());
        http._POST("client/client.php?get_client_operation=true", data).then(res => {
            dispatch(getClientOperationSucess(res.clientes_operacion));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function add(data) {
    return dispatch => {
        dispatch(request());
        http._POST("client/client.php?add=true", data).then(res => {
            if (res.err == 'false') {
                dispatch(getClientOperation(data));
                dispatch(succes(res.msj, 'success'));
            } else {
                dispatch(succes(res.msj, 'warning'));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function getActivos(data) {
    return dispatch => {
        dispatch(request());
        http._POST("client/client.php?get_activos=true", data).then(res => {
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

function getOperation() {
    return dispatch => {
        dispatch(request());
        http._GET("client/client.php?get_operation=true").then(res => {
            dispatch(getOperationSuccess(res.operaciones));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function changeStatus(data) {
    return dispatch => {
        dispatch(request());
        http._POST("client/client.php?change_status=true", data).then(res => {
            if (res.err == 'false') {
                dispatch(getClientOperation(data));
                dispatch(succes(res.msj, 'success'));
            } else {
                dispatch(succes(res.msj, 'warning'));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function getProductOperation(data) {
    return dispatch => {
        dispatch(request());
        http._POST("client/client.php?get_product_operation=true", data).then(res => {
            dispatch(getProductOperationSucess(res.productos_operacion));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function addProduct(data) {
    return dispatch => {
        dispatch(request());
        http._POST("client/client.php?add_produto=true", data).then(res => {
            if (res.err == 'false') {
                dispatch(getProductOperation(data));
                dispatch(succes(res.msj, 'success'));
            } else {
                dispatch(succes(res.msj, 'warning'));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function changeStatusProduct(data) {
    return dispatch => {
        dispatch(request());
        http._POST("client/client.php?change_status_product=true", data).then(res => {
            if (res.err == 'false') {
                dispatch(getProductOperation(data));
                dispatch(succes(res.msj, 'success'));
            } else {
                dispatch(succes(res.msj, 'warning'));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

export default {
    get,
    getActivos,
    getProductoCliente,
    getOperation,
    getClientOperation,
    add,
    changeStatus,
    getProductOperation,
    addProduct,
    changeStatusProduct
};