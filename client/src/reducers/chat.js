import {
    LOAD_MESSAGES,
    UPDATE_MESSAGE_FIELD,
    MESSAGE_SENT,
    SCROLL_TOP
} from '../constants/actionTypes';

const initialState = {
    messages: [],
    scrollTop: false
};

export default (state = initialState, action) => {

    switch (action.type) {
        case SCROLL_TOP:
            return {
                ...state,
                scrollTop: action.payload
            };
        case LOAD_MESSAGES:
            let unique = Object.create(null);

            return {
                ...state,
                messages: [...state.messages, ...action.payload ].sort(function (a,b) {
                    return a.dateTime - b.dateTime
                }).filter(obj => unique[obj._id]? false : unique[obj._id] = true),
                lastRecievedMessageTs: state.messages.length ? state.messages[ state.messages.length - 1 ].dateTime : null,
                firstRecievedMessageTs: state.messages.length ? state.messages[0].dateTime : null
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