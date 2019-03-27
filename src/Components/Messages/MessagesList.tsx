import React from 'react'
import * as _ from 'lodash'

import {Events, Element, animateScroll as scroll, scroller } from 'react-scroll'

import { Message, RoomUser } from '../../../store/types'

import { Grid } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import grey from '@material-ui/core/colors/grey'

import MessageItem from './MessageItem';

const styles = (theme: any) => ({
    rootStyles: {
        position: 'absolute' as 'absolute',
        height: '100%',
        overflowX: 'hidden' as 'hidden',
        overflowY: 'scroll' as 'scroll',
        left: '0',
        right: '0',
        paddingBottom: '190px',
    },
    scrollToEndStyles: {
        position: 'fixed' as 'fixed',
        background: grey[300],
        bottom: '150px',
        right: '20px',
        padding: '3px',
        borderRadius: '50%',
        cursor: 'pointer'
    }
});

interface Props extends WithStyles<typeof styles> {
    messages: Message[];
    lastMessageId?: string;
    roomUsers: RoomUser[];
    userId: string;
}

class MessagesList extends React.Component<Props, {}> {

    componentDidUpdate(prevProps: Props) {
        if (this.props.messages.length > prevProps.messages.length) {
            this.scrollToElement(this.props.lastMessageId!)
        }
    }

    scrollToElement(messageId: string) {

        let goToContainer = new Promise((resolve, reject) => {

          Events.scrollEvent.register('end', () => {
            resolve();
            Events.scrollEvent.remove('end');
          });

          scroller.scrollTo('scroll-container', {
            duration: 100,
            delay: 0,
          });

        });

        goToContainer.then(() =>
          scroller.scrollTo(messageId, {
            duration: 800,
            delay: 0,
            smooth: 'easeInOutQuart',
            containerId: 'scroll-container'
          }));
    }

    renderMessage = (message: Message) => (
        <Element key={message.id} name={String(message.id)}>
            <MessageItem
                message={message}
                userId={this.props.userId}
                roomUsers={this.props.roomUsers}
            />
        </Element>
    )

    render () {
        return (
            <div className={this.props.classes.rootStyles} id="scroll-container">
                <Grid container justify = "center">
                    <Grid item xs={10}>
                        <List>
                            {this.props.messages.map((message) => this.renderMessage(message))}
                        </List>
                    </Grid>
                </Grid>

                {this.props.lastMessageId &&
                    <div
                        className={this.props.classes.scrollToEndStyles}
                        onClick={(e: any) => this.scrollToElement(this.props.lastMessageId!)}
                    >
                        <KeyboardArrowDown />
                    </div>
                }
            </div>
        )
    }
}

export default withStyles(styles)(MessagesList)