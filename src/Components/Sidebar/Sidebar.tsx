import React from 'react'
import cc from 'classcat'

import { WithStyles, withStyles, createStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';

import { DRAWER_WIDTH } from '../Dashboard'
import Search from './Search';
import { SubscribedRoom, RoomDataCollection, PresenceData } from '../../../store/types';
import RoomsListHeader from './RoomsListHeader';
import RoomItem from './RoomItem';

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
    }
})

interface Props extends WithStyles<typeof styles> {
    open: boolean;
    currentRoomId: string
    publicRooms: SubscribedRoom[]
    notificationsCollection: RoomDataCollection<boolean>
    leagueRoom?: SubscribedRoom
    leagueUsers?: any
    presenceData: PresenceData
    changeCurrentRoomId: (id: string) => void
    handleDrawerClose: () => void
}

class Sidebar extends React.Component<Props> {

    leagueUserClicked = (id: string) => {
        console.log(id, 'id');
    }

    renderLeagueUsers = () => {
        return this.props.leagueUsers.map((user: any) =>
            <RoomItem
                key={user.id}
                item={user}
                selected={false}
                showNotification={false}
                onClick={this.leagueUserClicked}
                presenceData={this.props.presenceData}
            />
        );
    }

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
                        <RoomItem
                            key={room.id}
                            item={room}
                            selected={room.id === this.props.currentRoomId}
                            showNotification={this.props.notificationsCollection[room.id]}
                            onClick={this.props.changeCurrentRoomId}
                        />
                    )}
                </List>
                <Divider />
                {this.props.leagueRoom &&
                    <List>
                        <div>
                            <RoomsListHeader title={this.props.leagueRoom.name!}>
                                <PersonIcon />
                            </RoomsListHeader>
                            {this.renderLeagueUsers()}
                        </div>
                    </List>
                }
                <Divider />
            </Drawer>
        )
    }
}

export default withStyles(styles)(Sidebar)