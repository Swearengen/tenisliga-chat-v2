import React from 'react'
import cc from "classcat"

import { WithStyles, withStyles, createStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { DRAWER_WIDTH } from './Dashboard'
import { SubscribedRoom, PrivateSubscribedRoom } from '../../store/types';

export const styles = (theme: any) => createStyles({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    appBarShift: {
        marginLeft: DRAWER_WIDTH,
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
})

interface Props extends WithStyles<typeof styles> {
    open: boolean
    currentRoom: SubscribedRoom | PrivateSubscribedRoom
    handleDrawerOpen: () => void
}

function isPrivateSubscribedRoom(item: PrivateSubscribedRoom | SubscribedRoom): item is PrivateSubscribedRoom {
    return (item as PrivateSubscribedRoom).displayName !== undefined;
}

const AppHeader: React.SFC<Props> = (props) => {

    function roomName(item: PrivateSubscribedRoom | SubscribedRoom) {
        if (isPrivateSubscribedRoom(item)) {
            return item.displayName
        }

        return item.name
    }

    return (
        <AppBar
            position="absolute"
            className={cc([props.classes.appBar, props.open && props.classes.appBarShift])}
        >
            <Toolbar disableGutters={!props.open} className={props.classes.toolbar}>
                <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={props.handleDrawerOpen}
                    className={cc([props.classes.menuButton, props.open && props.classes.menuButtonHidden])}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    className={props.classes.title}
                >
                    {props.currentRoom && roomName(props.currentRoom)}
                </Typography>
                <div>
                    <img src="/static/logo.png" style={{height: '64px'}} />
                </div>
            </Toolbar>
        </AppBar>
    )

}

export default withStyles(styles)(AppHeader)