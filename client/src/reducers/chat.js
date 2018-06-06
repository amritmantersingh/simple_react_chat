import {
    LOAD_MESSAGES,
    UPDATE_MESSAGE_FIELD,
    MESSAGE_SENT,
    SCROLL_MESSAGES,
    START_LOADING_MESSAGES,
    FINISH_LOADING_MESSAGES,
    RESET_UNREAD_MESSAGES_COUNTER,
    GIPHY_MODAL_SHOW,
    GIPHY_MODAL_CLOSE,
    CHANGE_GIPHY_SEARCH_QUERY,
    LOAD_GIPHYS_LIST,
    LOAD_MORE_GIPHYS
} from '../constants/actionTypes';

const initialState = {
    messages: [],
    lastRecievedMessageTs: 0,
    firstRecievedMessageTs: 0,
    scroll: {},
    sentMessagesCounter: 0,
    unreadMessagesCounter: 0,
    giphy: {
        modalShow: false,
        searchQuery: '',
        giphysList: [],
        isSearching: false,
        offset: 0
    }
};
const mergedArraysById = (arr1, arr2) => {
    let unique = Object.create(null);
    return [ ...arr1, ...arr2 ].filter( obj => unique[obj.id]? false : unique[obj.id] = true )
}

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
                    scrollBottom: action.payload
                }
            };
        case LOAD_MESSAGES:
            let messages = mergedArraysById( state.messages, action.payload ).sort(function (a,b) {
                return a.dateTime - b.dateTime
            });
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
            };
        case GIPHY_MODAL_SHOW:
            return {
                ...state,
                giphy: {
                    ...state.giphy,
                    modalShow: true
                }
            };
        case GIPHY_MODAL_CLOSE:
            return {
                ...state,
                giphy: {
                    ...state.giphy,
                    modalShow: false
                }
            };
        case CHANGE_GIPHY_SEARCH_QUERY:
            return {
                ...state,
                giphy: {
                    ...state.giphy,
                    searchQuery: action.payload,
                    isSearching: true
                }
            };
        case LOAD_GIPHYS_LIST:
            return {
                ...state,
                giphy: {
                    ...state.giphy,
                    giphysList: action.payload.data,
                    isSearching: false,
                    offset: 0
                }
            };
        case LOAD_MORE_GIPHYS:
            let listOfUniqueGifs = mergedArraysById( state.giphy.giphysList, action.payload.data )
            return {
                ...state,
                giphy: {
                    ...state.giphy,
                    giphysList: listOfUniqueGifs,
                    isSearching: false,
                    offset: 20 + state.giphy.offset
                }
            };
        default:
            return state;
    }
};