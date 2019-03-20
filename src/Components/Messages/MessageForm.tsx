import React from 'react'
import { observer } from 'mobx-react'
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

interface State {
    text: string;
}

interface Props extends WithStyles<typeof styles> {
    onChange: () => void;
    onSubmit: (text: string) => void;
}

@observer
class MessageForm extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            text: '',
        }
    }

    onSubmit = () => {
        this.props.onSubmit(this.state.text)
        this.setState({ text: '' })
    }

    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ text: e.target.value })
        if (this.props.onChange) {
            this.props.onChange()
        }
    }

    onKeyPress = (e: any) => {
        if (e.key === 'Enter' && e.shiftKey) {
            this.setState({text: `${this.state.text}\n`})
            e.preventDefault();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            this.onSubmit()
        }
    }

    render () {
        const { classes } = this.props

        return (
            <form noValidate autoComplete="off">
                <TextField
                    id="standard-multiline-flexible"
                    placeholder="Placeholder"
                    multiline
                    rowsMax="3"
                    value={this.state.text}
                    onChange={this.onChange}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    InputProps={{className: classes.input}}
                    onKeyPress={this.onKeyPress}
                    className={classes.root}
                />
            </form>
        )
    }
}

export default withStyles(styles)(MessageForm)