import * as React from 'react';
import * as _ from 'lodash'
import cc from 'classcat'
import Typography from '@material-ui/core/Typography';
import { Message, RoomUser } from '../../../store/types';
import { ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles'
import teal from '@material-ui/core/colors/teal';
import NotInterested from '@material-ui/icons/NotInterested';

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

    const getSender = (senderId: string) => {
        return _.find(props.roomUsers, {id: senderId}) as RoomUser
    }

    const renderOwnMessages = () => {
        if (!props.message.text) {
            return <div></div>
        }
        return (
            <ListItem style={{justifyContent: 'flex-end'}}>
                <ListItemText style={{flex: '0 0 auto'}}
                    primary={
                        <Typography component="div" variant="caption">
                            {formatMessageDate(props.message.createdAt)}
                        </Typography>
                    }
                    secondary={
                        <Typography variant="body2" className={cc([props.classes.messageText, props.classes.own])}>
                            {props.message.text}
                        </Typography>
                    }
                />
            </ListItem>
        )
    }

    const sender = getSender(props.message.senderId)

    const renderOtherUserMessage = () => {
        if (!props.message.text) {
            return <div></div>
        }


        return (
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={sender.avatarURL || '/static/avatarPlaceholder.png'} />
                </ListItemAvatar>
                <ListItemText style={{flex: '0 0 auto'}}
                    primary={
                        <Typography component="div" variant="caption">
                            <strong>{sender.name || ''}</strong>: {formatMessageDate(props.message.createdAt)}
                        </Typography>
                    }
                    secondary={
                        <Typography variant="body2" className={props.classes.messageText}>
                            {props.message.text}
                        </Typography>
                    }
                />
            </ListItem>
        )
    }

    const renderNoUserMessage = () => (
        <ListItem alignItems="flex-start">
            <NotInterested />
            <ListItemText style={{flex: '0 0 auto'}}
                primary={
                    <Typography component="div" variant="caption">
                        <strong>User deleted</strong>
                    </Typography>
                }
                secondary={
                    <Typography variant="body2" className={props.classes.messageText}>
                        {props.message.text}
                    </Typography>
                }
            />
        </ListItem>
    )

    if (!sender) {
        return renderNoUserMessage()
    } else if (props.message.senderId === props.userId) {
        return renderOwnMessages()
    } else {
        return renderOtherUserMessage()
    }
}

export default withStyles(styles)(MessageItem)