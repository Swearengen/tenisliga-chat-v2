import React from 'react'
import { WithStyles, withStyles, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';

export const styles = (theme: any) => createStyles({
    root: {
        paddingTop: '100px'
    },
})

interface Props extends WithStyles<typeof styles> {}

class A extends React.Component<Props> {
    handleClose = () => {
        console.log('fffff');

    }

    render() {
        const { classes } = this.props

        return (
            <div className={classes.root}>
                <Button color="primary" onClick={this.handleClose}>
                    OK
                </Button>
            </div>
        )
    }
}

export default withStyles(styles)(A)