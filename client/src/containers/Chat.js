import React, { Component } from 'react';
import {
    LOAD_MESSAGES,
    UNCHECK_AUTH_TOKEN,
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
import { connect } from 'react-redux';
import axios from 'axios';
import giphy from '../giphy'
import socket from '../socket';

import TopBar from './components/TopBar';
import MessagesList from './components/MessagesList'
import InputMessageArea from './components/InputMessageArea'
import GiphySelect from './components/GiphySelect'

const mapStateToProps = state => ({ ...state.chat, ...{ username: state.auth.session.user.username, authenticated: state.auth.session.authenticated}});

const mapDispatchToProps = (dispatch) => ({

    onStartLoadingMessages: () => { dispatch({type: START_LOADING_MESSAGES}) },
    onMessagesLoaded: () => { dispatch({type: FINISH_LOADING_MESSAGES}) },
    onGetMessages: (messages) => dispatch({ type: LOAD_MESSAGES, payload: messages }),
    onChangeMessageText: value =>
        dispatch({type: UPDATE_MESSAGE_FIELD, value}),
    onMessageSend: () => dispatch({ type: MESSAGE_SENT }),
    onLogout: () => {
        window.localStorage.removeItem('token');
        axios.defaults.headers.common['Authorization'] = '';
        dispatch({ type: UNCHECK_AUTH_TOKEN })
    },
    onScroll: (scrollBottom) => {
        dispatch({type: SCROLL_MESSAGES, payload: scrollBottom })
    },
    onReadMessages: () => {
        dispatch({type: RESET_UNREAD_MESSAGES_COUNTER})
    },
    onGiphyModalShow: () => {
        dispatch({type: GIPHY_MODAL_SHOW })
    },
    onGiphyModalClose: () => {
        dispatch({type: GIPHY_MODAL_CLOSE })
    },
    onChangeGiphySearchQuery: query => {
        dispatch({type: CHANGE_GIPHY_SEARCH_QUERY, payload: query });
        if ( query && query.length ) giphy.search(query, 0, (res) => dispatch({type: LOAD_GIPHYS_LIST , payload: res }))
    },
    onLoadMoreGiphys: ( query, offset ) => {
        giphy.search(query, offset, (res) => dispatch({type: LOAD_MORE_GIPHYS , payload: res }))
    }

});

class Chat extends Component {
    constructor(props) {
        super(props);
        this.token = window.localStorage.getItem('token');
        this.client = socket(this.token);
        this.changeMessageText = ev => this.props.onChangeMessageText(ev.target.value);
        this.onChangeGiphySearchQuery = ev => this.props.onChangeGiphySearchQuery(ev.target.value);
        this.onLoadMoreGiphys = this.props.onLoadMoreGiphys.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.getMessages = this.getMessages.bind(this);
        this.logOut = () => this.props.onLogout();
    }
    componentDidMount () {
        this.client.registerMessageHandler((messages) => {
            this.props.onGetMessages(messages);
            this.props.onMessagesLoaded();
        });
        this.getMessages(true);
    }
    getMessages = (isBefore, ts, count) => {
        this.client.getMessages({
            isBefore: isBefore,
            ts: ts,
            count: count
        });
    }
    sendMessage = ( msg ) => {
        const message = {
            username: this.props.username,
            text: msg
        }
        this.client.message(message);
        this.props.onMessageSend();
    }
    render () {
        return (
            <div>
                <TopBar
                    onLogout={this.logOut} />
                <MessagesList
                    onLoadingStart={this.props.onStartLoadingMessages}
                    onLoadingFinished={this.props.onMessagesLoaded}
                    isLoading={this.props.loading}
                    getMessages={this.getMessages}
                    scroll={this.props.scroll}
                    onScroll={this.props.onScroll}
                    ref='messages'
                    user={this.props.username}
                    messages={this.props.messages}
                    sentMessagesCounter={this.props.sentMessagesCounter}
                    unreadMessagesCounter={this.props.unreadMessagesCounter}
                    onReadMessages={this.props.onReadMessages}
                    client={this.client}
                />
                <GiphySelect
                    open={this.props.giphy.modalShow}
                    onRequestClose={this.props.onGiphyModalClose}
                    inputHandler={this.onChangeGiphySearchQuery}
                    giphy={this.props.giphy}
                    sendGif={this.sendMessage}
                    loadMoreGiphys={this.onLoadMoreGiphys}
                />
                <InputMessageArea
                    messageText={this.props.messageText}
                    submitHandler={this.sendMessage}
                    inputHandler={this.changeMessageText}
                    giphyModalShowHandler={this.props.onGiphyModalShow}
                />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);