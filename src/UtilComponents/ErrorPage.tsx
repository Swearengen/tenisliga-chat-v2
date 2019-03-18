import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export const ErrorPage: React.SFC = (props) => {

    return (
        <Grid container spacing={24} justify="center">
            <Grid item xs={6}>
              <Typography variant="h5" gutterBottom align="center" style={{marginTop: '100px'}}>
                {props.children}
              </Typography>
            </Grid>
        </Grid>
    )

}