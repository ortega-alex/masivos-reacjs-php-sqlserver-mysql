import { TextConstants } from '../_constants/index';
import http from '../_services/http.services';

function request() { return { type: TextConstants.REQUEST_TEXT } }
function failure(err) { return { type: TextConstants.FAILURE_TEXT, err } }
function succes(msj, tipo) { return { type: TextConstants.SUCCESS_TEXT, msj, tipo } }
function getSuccess(textos) { return { type: TextConstants.GET_TEXTS, textos } }
function getTextoClienteSuccess(textos_cliente) { return { type: TextConstants.GET_TEXT_CLIENT, textos_cliente } }
function getImagesSuccess(images) { return { type: TextConstants.GET_IMAGES, images } }
function getImagesActSuccess(images_activas) { return { type: TextConstants.GET_IMAGES_ACT, images_activas } }

function get() {
    return dispatch => {
        dispatch(request());
        http._GET("mail/text.php?get=true").then(res => {
            dispatch(getSuccess(res.textos));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function getTextoCliente(data) {
    return dispatch => {
        dispatch(request());
        http._POST("mail/text.php?get_textos_cliente=true", data).then(res => {
            dispatch(getTextoClienteSuccess(res.textos_cliente));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function add(data) {
    return dispatch => {
        dispatch(request());
        http._POST("mail/text.php?add=true", data).then(res => {
            if (res.err == 'false') {
                dispatch(succes(res.msj, 'success'));
                dispatch(get());
            } else {
                dispatch(succes(res.msj, 'error'));
            }
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function changeStatus(data) {
    return dispatch => {
        dispatch(request());
        http._POST("mail/text.php?change_status=true", data).then(res => {
            if (res.err == 'false') {
                dispatch(succes(res.msj, 'success'));
                dispatch(get());
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
        http._GET("mail/text.php?get_images=true").then(res => {
            dispatch(getImagesSuccess(res.images));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function getImagesACT() {
    return dispatch => {
        dispatch(request());
        http._GET("mail/text.php?get_images_activas=true").then(res => {
            dispatch(getImagesActSuccess(res.images_activas));
        }).catch(err => {
            dispatch(failure(err.toString()));
        });
    }
}

function addImage(data) {
    return dispatch => {
        dispatch(request());
        http._POST("mail/text.php?add_image=true", data).then(res => {
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
        http._POST("mail/text.php?change_status_image=true", data).then(res => {
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
    getTextoCliente,
    add,
    changeStatus,
    getImages,
    getImagesACT,
    addImage,
    changeStatusImage
};