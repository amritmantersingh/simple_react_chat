import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

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

export default TopBar;