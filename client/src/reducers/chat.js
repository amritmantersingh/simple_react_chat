import {
    LOAD_MESSAGES,
    UPDATE_MESSAGE_FIELD,
    MESSAGE_SENT
} from '../constants/actionTypes';

const initialState = {
    messages: []
};
//
export default (state = initialState, action) => {

    switch (action.type) {
        case LOAD_MESSAGES:
            let seenKeys = Object.create(null);

            return {
                ...state,
                messages: [...state.messages, ...action.payload ].sort(function (a,b) {
                    return a.dateTime - b.dateTime
                }).filter(obj => seenKeys[obj._id]? false : seenKeys[obj._id] = true)
            };
        case UPDATE_MESSAGE_FIELD:
            return {
                ...state,
                messageText: action.value
            };
        case MESSAGE_SENT:
            return {
                ...state,
                messageText: ''
            };
        default:
            return state;
    }

    return state;

};