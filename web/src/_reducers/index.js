import { combineReducers } from 'redux';

// REDUCERS
import _users from "./user.reducers";
import _mails from "./mail.reducers";

export default combineReducers({
    _users,
    _mails
});