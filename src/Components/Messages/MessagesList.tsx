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

    componentDidUpdate(prevProps: Props) {
        console.log(this.child.current);

        if (prevProps.messages.length < this.props.messages.length) {
            this.child.current.scrollToBottom()
        }
    }

    getSenderName = (senderId: string) => {
        let sender = _.find(this.props.roomUsers, {id: senderId}) as RoomUser
        return sender ? sender.name : ''
    }

    renderOtherUserMessage = (message: Message) => {
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
                            {message.parts[0].payload.content}
                        </Typography>
                    }
                />
            </ListItem>
        )
    }

    renderOwnMessages = (message: Message) => {
        const { classes } = this.props
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

    render () {
        return (
            <ScrollableCont ref={this.child}>
                <Grid container justify = "center">
                    <Grid item xs={10}>
                        <List>
                            {this.props.messages.map((message) => (
                                message.senderId === this.props.userId ? (
                                    this.renderOwnMessages(message)
                                ) : (
                                    this.renderOtherUserMessage(message)
                                )
                            ))}
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            fsfsd
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            fsdfsd
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            1
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            1
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            1
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            1
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            <ListItem style={{justifyContent: 'flex-end'}}>
                                <ListItemText className={this.props.classes.listText}
                                    primary={
                                        <Typography component="div" variant="caption">
                                            2
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" className={cc([this.props.classes.messageText, this.props.classes.own])}>
                                            2
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </ScrollableCont>
        )
    }
}

export default withStyles(styles)(MessagesList)