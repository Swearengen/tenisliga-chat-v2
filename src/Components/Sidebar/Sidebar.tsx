import React from 'react'
import cc from 'classcat'
import * as _ from 'lodash'

import { WithStyles, withStyles, createStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';

import { DRAWER_WIDTH } from '../Dashboard'
// import Search from './Search';
import { RoomDataCollection, PresenceData, SubscribedRoom, RoomUser, PrivateSubscribedRoom } from '../../../store/types';
import RoomsListHeader from './RoomsListHeader';
import RoomItem from './RoomItem';

export const styles = (theme: any) => createStyles({
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'space-between',
        justifyContent: 'flex-end',
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
        // [theme.breakpoints.up('sm')]: {
        //     display: 'block',
        //     width: theme.spacing.unit * 9,
        // },
    }
})

interface Props extends WithStyles<typeof styles> {
    open: boolean;
    currentRoomId: string
    userId: string
    publicRooms: SubscribedRoom[]
    privateRooms: PrivateSubscribedRoom[]
    notificationsCollection: RoomDataCollection<boolean>
    leagueRoom?: SubscribedRoom
    leagueUsers?: any
    presenceData: PresenceData
    changeRoom: (id: string) => void
    leagueUserClicked: (user: RoomUser) => void
    handleDrawerClose: () => void
}

const Sidebar: React.SFC<Props> = (props) => {
    const renderLeagueUsers = () => {
        return props.leagueUsers.map((user: any) =>
            <RoomItem
                key={user.id}
                item={user}
                selected={false}
                disableSelected={true}
                showNotification={false}
                onClick={(id: string) => props.leagueUserClicked(user)}
                presenceData={props.presenceData}
                presenceIdToCheck={user.id}
            />
        );
    }

    const renderPrivateMessages = () => {
        const privateRooms = props.privateRooms.map((room: SubscribedRoom) => {
            const presenceIdToCheck = _.find(room.userIds, (id: string) => id !== props.userId)
            return (
                <RoomItem
                    key={room.id}
                    item={room}
                    selected={room.id === props.currentRoomId}
                    showNotification={props.notificationsCollection[room.id]}
                    onClick={props.changeRoom}
                    presenceData={props.presenceData}
                    presenceIdToCheck={presenceIdToCheck}
                />
            )
        });

        return privateRooms
    }

    return (
        <Drawer
            variant="permanent"
            classes={{ paper: cc([props.classes.drawerPaper, !props.open && props.classes.drawerPaperClose]) }}
            open={props.open}
        >
            <div className={props.classes.toolbar}>
                {/* <Search /> */}
                <IconButton onClick={props.handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />

            <List>
                <RoomsListHeader title="Rooms"><PeopleIcon/></RoomsListHeader>
                {props.publicRooms.map(room =>
                    <RoomItem
                        key={room.id}
                        item={room}
                        selected={room.id === props.currentRoomId}
                        showNotification={props.notificationsCollection[room.id]}
                        onClick={props.changeRoom}
                    />
                )}
            </List>
            <Divider />
            {props.leagueRoom &&
                <List>
                    <RoomsListHeader title={`${props.leagueRoom.name!} oponents`}>
                        <PersonIcon />
                    </RoomsListHeader>
                    {renderLeagueUsers()}
                </List>
            }
            <Divider />
            {props.privateRooms &&
                <List>
                    <RoomsListHeader title="Private Messages">
                        <PersonIcon />
                    </RoomsListHeader>
                    {renderPrivateMessages()}
                </List>
            }
        </Drawer>
    )
}

export default withStyles(styles)(Sidebar)