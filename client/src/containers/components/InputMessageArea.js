import React, { Component, PureComponent } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';

class InputMessageArea extends PureComponent {
    constructor(props) {
        super(props);
        this.submitHandler = () => {
            if ( !this.props.messageText ) { return false }
            this.props.submitHandler( this.props.messageText );
        }
    }
    handleKeyPress = (event) => {
        if(event.key == 'Enter'){
            event.preventDefault();
            this.submitHandler();
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
                <IconButton
                    className="chat__send-button"
                    children='mood'
                    onClick={this.props.giphyModalShowHandler}
                    iconClassName="material-icons" />
                <IconButton
                    className="chat__send-button"
                    children='send'
                    onClick={this.submitHandler}
                    iconClassName="material-icons" />
            </Paper>
        )
    }
}

export default InputMessageArea;