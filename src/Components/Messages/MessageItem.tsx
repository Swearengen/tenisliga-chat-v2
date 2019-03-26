import * as React from 'react';
import * as _ from 'lodash'
import cc from 'classcat'
import Typography from '@material-ui/core/Typography';
import { Message, RoomUser } from '../../../store/types';
import { ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles'
import teal from '@material-ui/core/colors/teal';

import { formatMessageDate } from '../../utils'

const styles = (theme: any) => ({
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
})

interface Props extends WithStyles<typeof styles> {
    userId: string;
    message: Message
    roomUsers: RoomUser[]
}


const MessageItem: React.SFC<Props> = (props) => {

    function getSenderName (senderId: string) {
        let sender = _.find(props.roomUsers, {id: senderId}) as RoomUser
        return sender ? sender.name : ''
    }

    function renderOwnMessages (message: Message) {
        if (!message.text) {
            return <div></div>
        }
        return (
            <ListItem style={{justifyContent: 'flex-end'}}>
                <ListItemText style={{flex: '0 0 auto'}}
                    primary={
                        <Typography component="div" variant="caption">
                            {formatMessageDate(message.createdAt)}
                        </Typography>
                    }
                    secondary={
                        <Typography variant="body2" className={cc([props.classes.messageText, props.classes.own])}>
                            {message.text}
                        </Typography>
                    }
                />
            </ListItem>
        )
    }

    function renderOtherUserMessage (message: Message) {
        if (!message.text) {
            return <div></div>
        }

        return (
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src='/static/avatarPlaceholder.png' />
                </ListItemAvatar>
                <ListItemText style={{flex: '0 0 auto'}}
                    primary={
                        <Typography component="div" variant="caption">
                            <strong>{getSenderName(message.senderId)}</strong>: {formatMessageDate(message.createdAt)}
                        </Typography>
                    }
                    secondary={
                        <Typography variant="body2" className={props.classes.messageText}>
                            {message.text}
                        </Typography>
                    }
                />
            </ListItem>
        )
    }

    if (props.message.senderId === props.userId) {
        return renderOwnMessages(props.message)
    } else {
        return renderOtherUserMessage(props.message)
    }
}

export default withStyles(styles)(MessageItem)