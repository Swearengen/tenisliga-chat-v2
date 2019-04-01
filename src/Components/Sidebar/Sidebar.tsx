import React from 'react'
import cc from 'classcat'

import { WithStyles, withStyles, createStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';

import DraftsIcon from '@material-ui/icons/Drafts'

import { DRAWER_WIDTH } from '../Dashboard'
import Search from './Search';
import { SubscribedRoom, RoomDataCollection } from '../../../store/types';
import RoomsListHeader from './RoomsListHeader';

export const styles = (theme: any) => createStyles({
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: DRAWER_WIDTH,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
            width: 0,
            display: 'none',
        [theme.breakpoints.up('sm')]: {
                display: 'block',
          width: theme.spacing.unit * 9,
        },
    },
    nestedListItem: {
        paddingLeft: '25px',
        '&$selected': {
            color: '#3c3c3c',
            fontWeight: 900
        },
    },
    selected: {},
    secondary: {
        color: 'inherit',
        fontWeight: 'inherit'
    },
    notification: {
        padding: '2px 2px 0 2px',
        backgroundColor: theme.palette.error.main,
        borderRadius: '50%'
    },
    notificationIcon: {
        fontSize: '14px',
        color: 'white'
    }
})

interface Props extends WithStyles<typeof styles> {
    open: boolean;
    currentRoomId: string
    publicRooms: SubscribedRoom[]
    notificationsCollection: RoomDataCollection<boolean>
    changeCurrentRoomId: (id: string) => void
    handleDrawerClose: () => void
}

class Sidebar extends React.Component<Props> {

    render () {
        const { classes } = this.props

        return (
            <Drawer
                variant="permanent"
                classes={{ paper: cc([classes.drawerPaper, !this.props.open && classes.drawerPaperClose]) }}
                open={this.props.open}
            >
                <div className={classes.toolbar}>
                    <Search />
                    <IconButton onClick={this.props.handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />

                <List>
                    <RoomsListHeader title="Rooms"><PeopleIcon/></RoomsListHeader>
                    {this.props.publicRooms.map(room =>
                        <ListItem
                            key={room.id}
                            button
                            selected={room.id === this.props.currentRoomId}
                            classes={{
                                root: classes.nestedListItem,
                                selected: room.id === this.props.currentRoomId ? classes.selected : ''
                            }}
                            onClick={() => this.props.changeCurrentRoomId(room.id)}
                        >
                            <ListItemText
                                secondary={room.name}
                                classes={{secondary: this.props.currentRoomId ? classes.secondary : ''}}
                            />
                            {this.props.notificationsCollection[room.id] &&
                                <div className={classes.notification}>
                                    <DraftsIcon fontSize="small" classes={{
                                        root: classes.notificationIcon
                                    }} />
                                </div>
                            }
                        </ListItem>
                    )}
                </List>
                <Divider />
                <List>
                    <div>
                        <RoomsListHeader title="People"><PersonIcon /></RoomsListHeader>
                        <ListItem button className={classes.nestedListItem}>
                            <ListItemText secondary="Neko ime" />
                        </ListItem>
                        <ListItem button className={classes.nestedListItem}>
                            <ListItemText secondary="Drugo ime" />
                        </ListItem>
                    </div>
                </List>
            </Drawer>
        )
    }
}

export default withStyles(styles)(Sidebar)