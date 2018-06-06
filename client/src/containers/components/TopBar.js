import React, { Component, PureComponent } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

class TopBar extends PureComponent {
    render () {
        return (
            <div>
                <AppBar
                    className="chat__header"
                    title="TURBOCHAT 9001"
                    iconElementRight={
                        <IconButton
                            onClick={this.props.onLogout}
                            tooltip="Logout"
                            iconClassName="material-icons"
                        >
                            power_settings_new
                        </IconButton>
                    }
                />
            </div>
        )
    }
}

export default TopBar;