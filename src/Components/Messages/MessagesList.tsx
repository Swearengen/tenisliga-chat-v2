import React from 'react'
import * as _ from 'lodash'
import cc from 'classcat'

import { Message, RoomUser } from '../../../store/types'

import { Grid } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import teal from '@material-ui/core/colors/teal';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import grey from '@material-ui/core/colors/grey'

import { formatMessageDate } from '../../utils'
// import ScrollableCont from './ScrollableCont';

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
    },
    messageText: {
        backgroundColor: teal[100],
        borderRadius: '25px',
        maxWidth: '320px',
        padding: '5px 10px',
        display: 'inline-block',
        '&$own': {
            backgroundColor: teal[300],
        },
    },
    own: {},
    listText: {
        flex: '0 0 auto'
    },
});

interface Props extends WithStyles<typeof styles> {
    messages: Message[];
    roomUsers: RoomUser[];
    userId: string;
}

class MessagesList extends React.Component<Props, {}> {

    child: any

    constructor(props: Props) {
        super(props);
        this.child = React.createRef();
    }

    // componentDidMount () {
    //     const number = this.scrollToBottom!.getBoundingClientRect().top
    //     this.child.current.scrollToBottom(number)
    // }

    // componentDidUpdate(prevProps: Props) {
    //     if (prevProps.messages.length < this.props.messages.length) {
    //         const number = this.scrollToBottom!.getBoundingClientRect().top
    //         this.child.current.scrollToBottom(number)
    //     }
    // }

    // mountLastElementToScroll = (node: any) => {
    //     if (node) {
    //         console.log(node);

    //         console.log(node.getBoundingClientRect().top);
    //         this.scrollToBottom = node
    //     }
    // }

    getSenderName = (senderId: string) => {
        let sender = _.find(this.props.roomUsers, {id: senderId}) as RoomUser
        return sender ? sender.name : ''
    }

    renderOtherUserMessage = (message: Message) => {
        if (!message.text) {
            return
        }
        return (
            <ListItem key={message.id} alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src='/static/avatarPlaceholder.png' />
                </ListItemAvatar>
                <ListItemText className={this.props.classes.listText}
                    primary={
                        <Typography component="div" variant="caption">
                            <strong>{this.getSenderName(message.senderId)}</strong>: {formatMessageDate(message.createdAt)}
                        </Typography>
                    }
                    secondary={
                        <Typography variant="body2" className={this.props.classes.messageText}>
                            {message.text}
                        </Typography>
                    }
                />
            </ListItem>
        )
    }

    renderOwnMessages = (message: Message) => {
        const { classes } = this.props

        if (!message.text) {
            return
        }
        return (
            <ListItem key={message.id} style={{justifyContent: 'flex-end'}}>
                <ListItemText className={classes.listText}
                    primary={
                        <Typography component="div" variant="caption">
                            {formatMessageDate(message.createdAt)}
                        </Typography>
                    }
                    secondary={
                        <Typography variant="body2" className={cc([classes.messageText, classes.own])}>
                            {message.text}
                        </Typography>
                    }
                />
            </ListItem>
        )
    }

    scrollToBottom = () => {
        console.log('scroll');

    }

    render () {
        return (
            <div className={this.props.classes.rootStyles}>
                <Grid container justify = "center">
                    <Grid item xs={10}>
                        <List>
                            {this.props.messages.map((message) => {
                                return (
                                    message.senderId === this.props.userId ? (
                                        this.renderOwnMessages(message)
                                    ) : (
                                        this.renderOtherUserMessage(message)
                                    )
                                )
                            })}
                        </List>
                    </Grid>
                </Grid>

                <div className={this.props.classes.scrollToEndStyles} onClick={(e: any) => this.scrollToBottom()}>
                    <KeyboardArrowDown />
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(MessagesList)