import React from 'react'
import { withStyles, WithStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = (theme: any) => ({
    root: {
        marginTop: '10px',
    },
    input: {
        backgroundColor: '#fff',
    }
})

interface Props extends WithStyles<typeof styles> {
    value: string
    onChange: (text: string) => void;
    onSubmit: () => void;
}

const MessageForm: React.SFC<Props> = (props) => {
    function onChange (e: React.ChangeEvent<HTMLInputElement>) {
        props.onChange(e.target.value)
    }

    function onKeyPress (e: any) {
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            props.onSubmit()
        }
    }

    return (
        <form noValidate autoComplete="off">
            <TextField
                id="standard-multiline-flexible"
                placeholder="Placeholder"
                multiline
                rowsMax="3"
                value={props.value || ''}
                onChange={onChange}
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{className: props.classes.input}}
                onKeyPress={onKeyPress}
                className={props.classes.root}
            />
        </form>
    )
}

export default withStyles(styles)(MessageForm)