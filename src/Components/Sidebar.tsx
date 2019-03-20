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
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';

import { DRAWER_WIDTH } from './Dashboard'
import Search from './Search';

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
    disabled: {
        opacity: 1
    }
})

interface Props extends WithStyles<typeof styles> {
    open: boolean;
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
                    <div>
                        <ListItem button disabled classes={{disabled: classes.disabled}}>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Rooms" />
                        </ListItem>
                        <ListItem button selected classes={{
                            root: classes.nestedListItem,
                            selected: classes.selected
                        }}>
                            <ListItemText secondary="General" classes={{secondary: classes.secondary}}/>
                        </ListItem>
                        <ListItem button className={classes.nestedListItem}>
                            <ListItemText secondary="3.A liga 2019/10" />
                        </ListItem>
                    </div>
                </List>
                <Divider />
                <List>
                    <div>
                        <ListItem button disabled classes={{disabled: classes.disabled}}>
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="People" />
                        </ListItem>
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