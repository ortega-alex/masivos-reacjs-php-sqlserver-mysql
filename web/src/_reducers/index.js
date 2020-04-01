import { combineReducers } from 'redux';

// REDUCERS
import _users from "./user.reducers";
import _mails from "./mail.reducers";
import _clients from "./client.reducers";

export default combineReducers({
    _users,
    _mails,
    _clients
});