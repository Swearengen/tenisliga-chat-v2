import * as React from 'react';
import * as _ from 'lodash'
import cc from 'classcat'

import DraftsIcon from '@material-ui/icons/Drafts'

import { ListItem, ListItemText } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { SubscribedRoom, RoomUser, PresenceData, UserJoinedRoom } from '../../../store/types';

const styles = (theme: any) => ({
    nestedListItem: {
        paddingLeft: '25px',
        '&$selected': {
            color: '#3c3c3c',
            fontWeight: 900
        },
    },
    presence: {
        height: '10px',
        width: '10px',
        borderRadius: '50%',
        border: '1px solid #555',
        '&$selected': {
            backgroundColor: theme.palette.primary.light,
            border: `1px solid ${theme.palette.primary.light}`,
        }
    },
    selected: {},
    secondary: {
        color: 'inherit',
        fontWeight: 'inherit' as 'inherit'
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
    item: UserJoinedRoom | RoomUser
    showNotification: boolean
    selected: boolean
    presenceData?: PresenceData
    presenceIdToCheck?: string
    onClick: (id: string) => void
}

const RoomsListHeader: React.SFC<Props> = (props) => {

    function isPresent (id: string) {
        if (props.presenceData) {
            return props.presenceData[id] === 'online'
        }
    }

    return (
        <ListItem
            button
            selected={props.selected}
            classes={{
                root: props.classes.nestedListItem,
                selected: props.selected ? props.classes.selected : ''
            }}
            onClick={() => props.onClick(props.item.id)}
        >
            {props.presenceIdToCheck &&
                <div className={cc([props.classes.presence, isPresent(props.presenceIdToCheck) && props.classes.selected])} />
            }
            <ListItemText
                secondary={props.item.name}
                classes={{secondary: props.selected ? props.classes.secondary : ''}}
            />
            {props.showNotification &&
                <div className={props.classes.notification}>
                    <DraftsIcon fontSize="small" classes={{
                        root: props.classes.notificationIcon
                    }} />
                </div>
            }
        </ListItem>
    )
}

export default withStyles(styles)(RoomsListHeader)