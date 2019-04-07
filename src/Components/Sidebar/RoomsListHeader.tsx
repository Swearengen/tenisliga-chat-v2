import * as React from 'react';
import * as _ from 'lodash'

import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles'


const styles = (theme: any) => ({
    disabled: {
        opacity: 1
    }
})

interface Props extends WithStyles<typeof styles> {
    title: string
    children: any
}


const RoomsListHeader: React.SFC<Props> = (props) => {
    return (
        <ListItem button disabled classes={{disabled: props.classes.disabled}}>
            <ListItemIcon>
                {props.children}
            </ListItemIcon>
            <ListItemText primary={props.title} />
        </ListItem>
    )
}

export default withStyles(styles)(RoomsListHeader)