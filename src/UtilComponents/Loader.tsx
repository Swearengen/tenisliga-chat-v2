import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress'

export const Loader: React.SFC = (props) => {

    return (
        <Grid container spacing={24} justify="center" style={{margin: '30px auto'}}>
            <CircularProgress />
        </Grid>
    )

}