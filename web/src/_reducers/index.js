import { combineReducers } from 'redux';

// REDUCERS
import _users from "./user.reducers";
import _mails from "./mail.reducers";
import _clients from "./client.reducers";
import _texts from "./text.reducers";

export default combineReducers({
    _users,
    _mails,
    _clients,
    _texts
});