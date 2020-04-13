import { ClientConstants } from '../_constants/index';
import http from '../_services/http.services';

function request() { return { type: ClientConstants.REQUEST_CLIENT } }
function failure(err) { return { type: ClientConstants.FAILURE_CLIENT, err } }
function succes(msj, tipo) { return { type: ClientConstants.SUCCESS_CLIENT, msj, tipo } }
function getSucess(clientes) { return { type: ClientConstants.GET_CLIENTS, clientes } }
function getActSucess(clientes_activos) { return { type: ClientConstants.GET_CLIENT_ACT, clientes_activos } }
function getProductoClienteSucess(productos_cliente) { return { type: ClientConstants.GET_PRODUC_CLIENT, productos_cliente } }
function getTextoClienteSuccess(textos_cliente) { return { type: ClientConstants.GET_TEXT_CLIENT, textos_cliente } }
function getTextsSuccess(textos) { return { type: ClientConstants.GET_TEXTS, textos } }
function getImagesSuccess(images) { return { type: ClientConstants.GET_IMAGES, images } }
function getImagesActSuccess(images_activas) { return { type: ClientConstants.GET_IMAGES_ACT, images_activas } }

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

function getTextos() {
    return dispatch => {
        dispatch(request());
        http._GET("client/client.php?get_textos=true").then(res => {
            dispatch(getTextsSuccess(res.textos));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function addText(data) {
    return dispatch => {
        dispatch(request());
        http._POST("client/client.php?add_text=true", data).then(res => {
            if (res.err == 'false') {
                dispatch(succes(res.msj, 'success'));
                dispatch(getTextos());
            } else {
                dispatch(succes(res.msj, 'error'));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function changeStatusText(data) {
    return dispatch => {
        dispatch(request());
        http._POST("client/client.php?change_status_text=true", data).then(res => {
            if (res.err == 'false') {
                dispatch(succes(res.msj, 'success'));
                dispatch(getTextos());
            } else {
                dispatch(succes(res.msj, 'error'));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function getImages() {
    return dispatch => {
        dispatch(request());
        http._GET("client/client.php?get_images=true").then(res => {
            dispatch(getImagesSuccess(res.images));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function getImagesACT() {
    return dispatch => {
        dispatch(request());
        http._GET("client/client.php?get_images_activas=true").then(res => {
            dispatch(getImagesActSuccess(res.images_activas));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function addImage(data) {
    return dispatch => {
        dispatch(request());
        http._POST("client/client.php?add_image=true", data).then(res => {
            if (res.err == 'false') {
                dispatch(succes(res.msj, 'success'));
                dispatch(getImages());
            } else {
                dispatch(succes(res.msj, 'error'));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function changeStatusImage(data) {
    return dispatch => {
        dispatch(request());
        http._POST("client/client.php?change_status_image=true", data).then(res => {
            if (res.err == 'false') {
                dispatch(succes(res.msj, 'success'));
                dispatch(getImages());
            } else {
                dispatch(succes(res.msj, 'error'));
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
    getTextoCliente,
    getTextos,
    addText,
    changeStatusText,
    getImages,
    getImagesACT,
    addImage,
    changeStatusImage
};