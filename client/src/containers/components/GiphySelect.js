import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {GridList, GridTile} from 'material-ui/GridList';
import { Scrollbars } from 'react-custom-scrollbars';

class GiphySelect extends Component {
    constructor(props) {
        super(props);
        this.sendGif = (link) => {
            const gif = ['img', link];
            console.log(link)
            this.props.sendGif(gif);
            this.props.onRequestClose();
        };
    }
    render () {
        return (
            <Dialog
                title="GIPHY"
                contentStyle={{width: '96vw', maxWidth: '700px', maxHeight: '80vh'}}
                actions={[
                    <IconButton
                        children={'close'}
                        onClick={this.props.onRequestClose}
                        iconClassName={'material-icons'}
                        style={{position: "absolute", right: 8, top: 8}}
                    />
                ]}
                modal={false}
                open={this.props.open}
            >
                <TextField
                    fullWidth={true}
                    hintText="Search GIPHY"
                    value={this.props.giphy.searchQuery}
                    //defaultValue={this.props.giphy.searchQuery}
                    onChange={this.props.inputHandler}
                />
                { this.props.giphy.searchQuery.length ?
                    <InfinityScroller
                        onLoadMore={this.props.loadMoreGiphys}
                        isLoading={this.props.giphy.isSearching}
                        offset={this.props.giphy.offset}
                        query={this.props.giphy.searchQuery}
                    >
                        <GridList
                            style={{paddingRight: 12}}
                        >
                            { this.props.giphy.giphysList.map((gif) => (
                                <GridTile
                                    key={gif.id}
                                    title={gif.title}
                                    style={{cursor: "pointer"}}
                                    onClick={() => this.sendGif(gif.images.downsized.url)}
                                >
                                    <img src={gif.images.preview_gif.url} />
                                </GridTile>
                            )) }
                        </GridList>
                    </InfinityScroller> : ''
                }
                { ( !this.props.giphy.isSearching &&
                    this.props.giphy.searchQuery.length &&
                    !this.props.giphy.giphysList.length )
                        ?
                    <div>Not found gifs for '{this.props.giphy.searchQuery}'</div> : ''
                }
            </Dialog>
        )
    }
}

class InfinityScroller extends Component {
    constructor(props) {
        super(props);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleAboutToReachBottom = this.handleAboutToReachBottom.bind(this);
        this.onLoadMore = this.props.onLoadMore.bind(this);
    }
    handleAboutToReachBottom = () => {
        console.log(this.props.isLoading)
        !this.props.isLoading ?
        this.props.onLoadMore( this.props.query, ( this.props.offset + 20 ) ) : null;
    }
    handleUpdate(values) {
        const { scrollTop, scrollHeight, clientHeight } = values;
        const pad = 100; // 100px of the bottom
        // t will be greater than 1 if we are about to reach the bottom
        const t = ((scrollTop + pad) / (scrollHeight - clientHeight));
        if (t > 1) this.handleAboutToReachBottom();
    }
    render() {
        return (
            <Scrollbars
                onUpdate={this.handleUpdate}
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={200}
                autoHeight
                autoHeightMin={0}
                autoHeightMax={540}
                renderTrackHorizontal={({ style, ...props }) =>
                    <div {...props} style={{ ...style, display: 'none' }}/>
                }
            >
                {this.props.children}
            </Scrollbars>
        )
    }
}

export default GiphySelect;