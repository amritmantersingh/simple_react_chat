import React, { Component, PureComponent } from 'react';
import Avatar from 'material-ui/Avatar';
import moment from 'moment';

class Message extends PureComponent {
    constructor(props) {
        super(props);
    }
    render() {

        const user = this.props.username;
        const message = this.props.message;
        const nameSplited = message.username ? message.username.split(' ') : ['?','?'];
        const initials = nameSplited.length === 1 ? nameSplited[0].substr(0,2) : nameSplited.map((name) => name[0]).join('').substr(0,2);

        message.isSelf = user === message.username;

        return (
            <li className={"message " + ( message.isSelf ? "message_self" : "" ) }>
                <Avatar className="message__avatar">{ initials }</Avatar>
                <div className="message__container">
                    { !message.isSelf ? <div className="message__username">{message.username}</div> : ''}
                    <div className="message__text">{ message.text[0] === 'img' ? <img height={ message.text[2] ? message.text[2] : 'auto' } src={message.text[1]} /> : message.text}</div>
                    <div className="message__date-time"> {moment.unix(message.dateTime).format('HH:mm DD.MM.YY') } </div>
                </div>
            </li>
        )
    }
}

export default Message;