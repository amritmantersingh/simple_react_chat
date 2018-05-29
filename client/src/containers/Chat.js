import React, { Component } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import {
    LOAD_MESSAGES,
    UNCHECK_AUTH_TOKEN,
    UPDATE_MESSAGE_FIELD,
    MESSAGE_SENT,
    SCROLL_MESSAGES,
    START_LOADING_MESSAGES,
    FINISH_LOADING_MESSAGES,
    RESET_UNREAD_MESSAGES_COUNTER
} from '../constants/actionTypes';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Badge from 'material-ui/Badge';
import CircularProgress from 'material-ui/CircularProgress';
import { connect } from 'react-redux';
import agent from '../agent';
import axios from 'axios';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';

const mapStateToProps = state => ({ ...state.chat, ...{ username: state.auth.session.user.username, authenticated: state.auth.session.authenticated}});

const mapDispatchToProps = (dispatch) => ({
    onStartLoadingMessages: () => { dispatch({type: START_LOADING_MESSAGES}) },
    onMessagesLoaded: () => { dispatch({type: FINISH_LOADING_MESSAGES}) },
    getMessages: (query) => agent.Chat.getMessages(query).then( res => {
        res.data.length ? dispatch({ type: LOAD_MESSAGES, payload: res.data }) : null }),
    onChangeMessageText: value =>
        dispatch({type: UPDATE_MESSAGE_FIELD, value}),
    onMessageSend: (username, text) =>
        agent.Chat.sendMessage(username, text).then( res => {
            dispatch({ type: LOAD_MESSAGES, payload: [res.data] });
            dispatch({ type: MESSAGE_SENT });
        }),
    onLogout: () => {
        window.localStorage.removeItem('token');
        axios.defaults.headers.common['Authorization'] = '';
        dispatch({ type: UNCHECK_AUTH_TOKEN })
    },
    onScroll: (isScrolling, scrollTop, scrollBottom) => {
        dispatch({type: SCROLL_MESSAGES, payload: [ isScrolling, scrollTop, scrollBottom ]})
    },
    onReadMessages: () => {
        dispatch({type: RESET_UNREAD_MESSAGES_COUNTER})
    }
})

class Chat extends Component {
    constructor(props) {
        super(props);
        this.changeMessageText = ev => this.props.onChangeMessageText(ev.target.value);
        this.sendMessage = () => this.props.onMessageSend(this.props.username, this.props.messageText);
        this.logOut = () => this.props.onLogout();
    }
    componentDidMount () {
        setInterval(function() { if (this.props.authenticated) {
            this.props.getMessages(composeFetchMessagesQuery('after',this.props.lastRecievedMessageTs, 20))
        }}.bind(this), 3000);
    }
    componentWillMount () {
        this.props.getMessages(composeFetchMessagesQuery());
    }
    componentWillReceiveProps (nextProps) {
        nextProps.scrollTop === true ?  this.props.getMessages(composeFetchMessagesQuery(false, this.props.firstRecievedMessageTs, 20)) : null;
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
                    getMessages={this.props.getMessages}
                    scroll={this.props.scroll}
                    onScroll={this.props.onScroll}
                    ref='messages'
                    user={this.props.username}
                    messages={this.props.messages}
                    sentMessagesCounter={this.props.sentMessagesCounter}
                    unreadMessagesCounter={this.props.unreadMessagesCounter}
                    onReadMessages={this.props.onReadMessages}
                />
                <InputMessageArea
                    messageText={this.props.messageText}
                    submitHandler={this.sendMessage}
                    inputHandler={this.changeMessageText}
                />
            </div>
        )
    }
}

class TopBar extends Component {
    render () {
        return (
            <div>
                <AppBar
                    className="chat__header"
                    title="Chat 1.0.1"
                    iconElementRight={<IconButton
                        onClick={this.props.onLogout}
                        tooltip="Logout"
                        iconClassName="material-icons"
                    >
                        power_settings_new
                    </IconButton>}
                />
            </div>
        )
    }
}
class MessagesList extends Component {

    constructor(props) {
        super(props);
        this._timeout = null;
        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.onLoadingFinished = this.props.onLoadingFinished;
        this.onLoadingStart = this.props.onLoadingStart;
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }
    componentDidUpdate(prevProps) {
        !prevProps.messages.length ? this.scrollToBottom("instant") : null;
        this.loadOldMessagesOnScrollTop(prevProps);
        this.scrollToBottomOnSendMessage(prevProps);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.props.messages.length !== nextProps.messages.length ||
            !!nextProps.scroll.scrollTop ||
            !!nextProps.scroll.scrollBottom !== !!this.props.scroll.scrollBottom ||
            nextProps.isLoading !== this.props.isLoading ||
            nextProps.sentMessagesCounter !== this.props.sentMessagesCounter ||
            nextProps.unreadMessagesCounter !== this.props.unreadMessagesCounter
        )
    }
    scrollToBottomOnSendMessage = (prevProps) => {
        prevProps.sentMessagesCounter !== this.props.sentMessagesCounter ? this.scrollToBottom('smooth') : null;
    }
    scrollToBottom = (style) => {
        this.refs.messagesEnd.scrollIntoView({block: "end", behavior: 'instant'});
        this.props.onReadMessages()
    }
    loadOldMessagesOnScrollTop = (prevProps) => {
        const scrollContainer = this.refs.scrollbars;
        const isOnTop = prevProps.scroll.scrollTop;
        const isScroll = prevProps.scroll.scrollStatus;

        if ( isOnTop && isScroll ) {
            this.props.onLoadingStart();
            scrollContainer.scrollTop(1);
            this.props.getMessages(composeFetchMessagesQuery(0, this.props.messages[0].dateTime, 10)).then(()=>{
                this.onLoadingFinished();
            })
        }
    }
    onScrollHandler = (ev) =>  {
        const scrollContainer = this.refs.scrollbars;
        const scrollContainerHeight = scrollContainer.view.clientHeight;
        const scrollContentHeight = this.refs.messages.clientHeight;
        const scrollTop = scrollContainer.view.scrollTop;
        const isBottom = ( scrollContentHeight - scrollContainerHeight - scrollTop ) < 40;
        const isScrollTopChanged = this.props.scroll.scrollTop !== !scrollTop;
        const scrollStatus = this.props.scroll.scrollStatus;

        const pushScrollStatus = (status) => {
            let isScrollStatusChanged = !(status === scrollStatus);
            isBottom ? this.props.onReadMessages() : null;
            isScrollTopChanged || isScrollStatusChanged ? this.props.onScroll(status, !scrollTop, isBottom) : null;
        };
        if(this._timeout){
            clearTimeout(this._timeout);
        }
        this._timeout = setTimeout(() => {
            this._timeout = null;
            pushScrollStatus ( false );
        }, 150);
        pushScrollStatus ( true );

    }
    render () {
        const messages = this.props.messages ? this.props.messages : [];
        const user = this.props.user;
        const isLoading = this.props.isLoading;
        const isSelf = function (username) {
            return user === username;
        }

        const messagesListItems = messages.map((message) =>
        {
            let nameSplited = message.username.split(' ');
            let initials = nameSplited.length === 1 ? nameSplited[0].substr(0,2) : nameSplited.map((name) => name[0]).join('').substr(0,2);

            return <li key={message._id} className={"message " + ( isSelf(message.username) ? "message_self" : "" ) }>
                <Avatar className="message__avatar">{ initials }</Avatar>
                <div className="message__container">
                    { !isSelf(message.username) ? <div className="message__username">{message.username}</div> : ''}
                    <div className="message__text">{message.text}</div>
                    <div className="message__date-time"> {moment.unix(message.dateTime).format('HH:mm DD.MM.YY') } </div>
                </div>
            </li>
        }

        );

        return (
            <div className='chat__messages'>
                <Scrollbars
                    ref="scrollbars"
                    renderTrackHorizontal={({ style, ...props }) =>
                        <div {...props} style={{ ...style, display: 'none' }}/>
                    }
                    onScroll={this.onScrollHandler}
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                >
                    <div
                        className={'chat__loader ' + ( isLoading ? '' : 'hidden' ) }
                        ref='messagesStart'>
                        <CircularProgress
                            size={40}
                        />
                    </div>
                    <ul ref="messages">
                        {messagesListItems}
                    </ul>
                    <div className="chat__tobottom-wrapper"
                         ref='messagesEnd'>
                        <Badge
                            badgeContent={this.props.unreadMessagesCounter}
                            secondary={true}
                            onClick={this.scrollToBottom}
                            badgeStyle={{top: -8, right: -8, width: 20, height: 20, display: (this.props.unreadMessagesCounter !== 0 ? 'inline-flex' : 'none') }}
                            className={'chat__tobottom' + ( this.props.scroll.scrollBottom ? ' hidden' : '' ) }
                        >
                            <FloatingActionButton mini={true} backgroundColor="#fff" >
                                <FontIcon className="material-icons">keyboard_arrow_down</FontIcon>
                            </FloatingActionButton>
                        </Badge>
                    </div>
                </Scrollbars>
            </div>
        )
    }
}
class InputMessageArea extends Component {
    handleKeyPress = (event) => {
        if(event.key == 'Enter'){
            event.preventDefault();
            this.props.submitHandler();
        }
    }
    render () {
        return (
            <Paper className="chat__input-area" zDepth={2}>
                <TextField
                    className="chat__text-field"
                    hintText="Write message..."
                    multiLine={true}
                    rows={1}
                    rowsMax={2}
                    value={this.props.messageText}
                    defaultValue={this.props.messageText}
                    onChange={this.props.inputHandler}
                    onKeyPress={this.handleKeyPress}
                />
                <FloatingActionButton onClick={this.props.submitHandler} className="chat__send-button">
                    <FontIcon className="material-icons">send</FontIcon>
                </FloatingActionButton>
            </Paper>
        )
    }
}

const composeFetchMessagesQuery = (q, ts, c) => {
    const query = q ? ( q + '/' ) : 'before/';
    const timestamp = ts ? ( ts + '/' ) : ( moment().unix() + '/' );
    const count = c ? c : 40;
    return ( query + timestamp + count )
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);