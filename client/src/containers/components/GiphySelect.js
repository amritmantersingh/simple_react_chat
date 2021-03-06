import React, { Component, PureComponent } from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import {GridList, GridTile} from 'material-ui/GridList';
import { Scrollbars } from 'react-custom-scrollbars';

class GiphySelect extends PureComponent {
    constructor(props) {
        super(props);
        this.sendGif = ( link, height ) => {
            const gif = ['img', link, height];
            this.props.sendGif(gif);
            this.props.onRequestClose();
        };
    }
    render () {
        return (
            <Dialog
                title="GIPHY"
                contentStyle={{width: '96vw', maxWidth: '700px', maxHeight: '80vh'}}
                contentClassName={'chat__modal'}
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
                    onChange={this.props.inputHandler}
                />
                { this.props.giphy.searchQuery.length ?
                    <InfinityScroller
                        onLoadMore={this.props.loadMoreGiphys}
                        isLoading={this.props.giphy.isSearching}
                        offset={this.props.giphy.offset}
                        query={this.props.giphy.searchQuery}
                        //gipfysList={this.props.giphy.giphysList}
                    >
                        <GridList
                            style={{paddingRight: 12}}
                        >
                            { this.props.giphy.giphysList.map((gif) => (
                                <GridTile
                                    key={gif.id}
                                    title={gif.title}
                                    style={{cursor: "pointer"}}
                                    onClick={ () => this.sendGif( gif.images.fixed_height_downsampled.url, gif.images.fixed_height_downsampled.height ) }
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

class InfinityScroller extends PureComponent {
    constructor(props) {
        super(props);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleAboutToReachBottom = this.handleAboutToReachBottom.bind(this);
        this.onLoadMore = this.props.onLoadMore.bind(this);
    }
    handleAboutToReachBottom = () => {
        !this.props.isLoading ?
        this.props.onLoadMore( this.props.query, ( this.props.offset + 20 ) ) : null;
    }
    handleUpdate(values) {
        const { scrollTop, scrollHeight, clientHeight } = values;
        const pad = 150;
        const t = ((scrollTop + pad) / (scrollHeight - clientHeight));
        if ( t > 1 && !!clientHeight ) this.handleAboutToReachBottom();
    }
    render() {
        return (
            <Scrollbars
                className="giphy__scroll-container"
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