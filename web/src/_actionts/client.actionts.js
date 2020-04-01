import { ClientConstants } from '../_constants/index';
import http from '../_services/http.services';

function request() { return { type: ClientConstants.REQUEST_CLIENT } }
function failure(err) { return { type: ClientConstants.FAILURE_CLIENT, err } }
function getActSucess(clientes_activos) { return { type: ClientConstants.GET_CLIENT_ACT,  clientes_activos} }

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

export default {
    getActivos
};