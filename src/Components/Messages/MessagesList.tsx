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


import { formatMessageDate } from '../../utils'
import ScrollableCont from './ScrollableCont';

const styles = (theme: any) => ({
    messageText: {
        backgroundColor: teal[100],
        borderRadius: '50px',
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

const MessagesList: React.SFC<Props> = (props) => {

    const getSenderName = (senderId: string) => {
        let sender = _.find(props.roomUsers, {id: senderId}) as RoomUser
        return sender ? sender.name : ''
    }

    const renderOtherUserMessage = (message: Message) => {
        return (
            <ListItem key={message.id} alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src='/static/avatarPlaceholder.png' />
                </ListItemAvatar>
                <ListItemText className={props.classes.listText}
                    primary={
                        <Typography component="div" variant="caption">
                            <strong>{getSenderName(message.senderId)}</strong>: {formatMessageDate(message.createdAt)}
                        </Typography>
                    }
                    secondary={
                        <Typography variant="body2" className={props.classes.messageText}>
                            {message.parts[0].payload.content}
                        </Typography>
                    }
                />
            </ListItem>
        )
    }

    const renderOwnMessages = (message: Message) => {
        const { classes } = props
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
                            {message.parts[0].payload.content}
                        </Typography>
                    }
                />
            </ListItem>
        )
    }

    return (
        <ScrollableCont>
            <Grid container justify = "center">
                <Grid item xs={10}>
                    <List>
                        {props.messages.map((message) => (
                            message.senderId === props.userId ? (
                                renderOwnMessages(message)
                            ) : (
                                renderOtherUserMessage(message)
                            )
                        ))}
                    </List>
                </Grid>
            </Grid>
        </ScrollableCont>
    )
}

export default withStyles(styles)(MessagesList)