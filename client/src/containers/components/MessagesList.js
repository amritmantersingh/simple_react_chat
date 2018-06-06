import React, { Component, PureComponent } from 'react';
import Badge from 'material-ui/Badge';
import CircularProgress from 'material-ui/CircularProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import { Scrollbars } from 'react-custom-scrollbars';
import Message from './Message'

class MessagesList extends PureComponent {

    constructor(props) {
        super(props);
        this._timeout = null;
        this.onScrollHandler = this.onScrollHandler.bind(this);
        this.onLoadingFinished = this.props.onLoadingFinished;
        this.onLoadingStart = this.props.onLoadingStart;
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.client = this.props.client;
    }
    componentDidUpdate(prevProps) {
        if (
            prevProps.sentMessagesCounter !== this.props.sentMessagesCounter
            || !prevProps.messages.length
            || (prevProps.messages.length !== this.props.messages.length && this.props.scroll.scrollBottom)
        ) {
            this.scrollToBottom("instant")
        }
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return (
    //         nextProps.scroll.scrollTop === this.props.scroll.scrollTop &&
    //         nextProps.scroll.scrollStatus === this.props.scroll.scrollStatus &&
    //         this.props.scroll.scrollTop !== 0
    //     )
    // }
    scrollToBottom = ( style ) => {
        const scrollStyle = () => { if ( !!style.length && typeof style === 'string' ) {
            return style } else { return 'smooth' } };
        const scrollOpts = { block: "end", behavior: scrollStyle() };
        this.refs.messagesEnd.scrollIntoView(scrollOpts);
        this.props.onReadMessages()
    }
    onScrollHandler = (ev) =>  {
        const scrollContainer = this.refs.scrollbars;
        const scrollContainerHeight = scrollContainer.view.clientHeight;
        const scrollContentHeight = this.refs.messages.clientHeight;
        const scrollTop = scrollContainer.view.scrollTop;
        const scrollBottom = scrollContentHeight - scrollContainerHeight - scrollTop;
        this.isScroll = true;
        this.isOnBottom = scrollBottom < 150;
        this.isOnBottom !== this.props.scroll.scrollBottom ?
            this.props.onScroll(this.isOnBottom) : null;

        if(this._timeout){
            clearTimeout(this._timeout);
        }
        this._timeout = setTimeout(() => {
            this._timeout = null;
            this.isScroll = false
        }, 50)
        if ( scrollTop === 0 && this.isScroll ) {
            this.props.onLoadingStart();
            scrollContainer.scrollTop(1);
            this.props.getMessages(true, this.props.messages[0].dateTime, 10);
        }
    }

    render () {
        const messages = this.props.messages ? this.props.messages : [];
        const user = this.props.user;
        const isLoading = this.props.isLoading;
        const messagesListItems = messages
            .map( (message) => <Message key={message.id} username={user} message={message} /> );

        return (
            <div className='chat__messages'>
                <Scrollbars
                    className="chat__scroll-container"
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
                    <div ref='messagesEnd' ></div>
                </Scrollbars>
                <Badge
                    badgeContent={this.props.unreadMessagesCounter}
                    secondary={true}
                    onClick={this.scrollToBottom}
                    style={{position: 'fixed'}}
                    badgeStyle={{top: -8, right: -8, width: 20, height: 20, display: (this.props.unreadMessagesCounter !== 0 ? 'inline-flex' : 'none') }}
                    className={'chat__tobottom' + ( messages.length && !this.props.scroll.scrollBottom ? ' visible' : '' ) }
                >
                    <FloatingActionButton mini={true} backgroundColor="#fff" >
                        <FontIcon className="material-icons">keyboard_arrow_down</FontIcon>
                    </FloatingActionButton>
                </Badge>
            </div>
        )
    }
}

export default MessagesList;