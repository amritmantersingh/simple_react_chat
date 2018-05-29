import {
    LOAD_MESSAGES,
    UPDATE_MESSAGE_FIELD,
    MESSAGE_SENT,
    SCROLL_MESSAGES,
    START_LOADING_MESSAGES,
    FINISH_LOADING_MESSAGES,
    RESET_UNREAD_MESSAGES_COUNTER
} from '../constants/actionTypes';

const initialState = {
    messages: [],
    lastRecievedMessageTs: 0,
    firstRecievedMessageTs: 0,
    scroll: {},
    sentMessagesCounter: 0,
    unreadMessagesCounter: 0
};

export default (state = initialState, action) => {

    switch (action.type) {
        case START_LOADING_MESSAGES:
            return {
                ...state,
                loading: true
            };
        case FINISH_LOADING_MESSAGES:
            return {
                ...state,
                loading: false
            };
        case SCROLL_MESSAGES:
            return {
                ...state,
                scroll: {
                    scrollStatus: action.payload[0],
                    scrollTop: action.payload[1],
                    scrollBottom: action.payload[2]
                }
            };
        case LOAD_MESSAGES:
            let unique = Object.create(null);
            let messages = [...state.messages, ...action.payload ].sort(function (a,b) {
                return a.dateTime - b.dateTime
            }).filter(obj => unique[obj._id]? false : unique[obj._id] = true);
            return {
                ...state,
                messages: messages,
                unreadMessagesCounter: ( ( state.messages.length && messages[0].dateTime === state.messages[0].dateTime ) ? ( messages.length - state.messages.length + state.unreadMessagesCounter ) : state.unreadMessagesCounter ),
                lastRecievedMessageTs: messages.length ? messages[ messages.length - 1 ].dateTime : null,
                firstRecievedMessageTs: messages.length ? messages[0].dateTime : null
            };
        case UPDATE_MESSAGE_FIELD:
            return {
                ...state,
                messageText: action.value
            };
        case MESSAGE_SENT:
            return {
                ...state,
                messageText: '',
                sentMessagesCounter: ++state.sentMessagesCounter
            };
        case RESET_UNREAD_MESSAGES_COUNTER:
            return {
                ...state,
                unreadMessagesCounter: 0
            }
        default:
            return state;
    }

};