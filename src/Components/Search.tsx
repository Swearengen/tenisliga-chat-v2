import React from 'react'
import { WithStyles, withStyles, createStyles } from '@material-ui/core/styles';
import * as _ from 'lodash'
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import InputBase from '@material-ui/core/InputBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';


interface SelectOption {
    value: string;
    label: string;
}

const suggestions: SelectOption[] = [
    { value: '1', label: 'Chocolate' },
    { value: '2', label: 'Strawberry' },
    { value: '3', label: 'Vanilla' }
];

export const styles = (theme: any) => createStyles({
    root: {
        flexGrow: 2,
        height: '100%',
        display: 'flex',
        alignItems: 'center'
    },
    container: {
        position: 'relative',
        width: '100%'
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});

function renderInputComponent(inputProps: any) {
    const { classes, inputRef = () => {}, ref, ...other } = inputProps;

    return (
        <InputBase
            fullWidth
            className={classes.input}
            inputRef={ (node) => {
                ref(node)
                inputRef(node)
            }}
            {...other}
            startAdornment={
                <InputAdornment position="start">
                    <SearchIcon />
                </InputAdornment>
            }
        />
    );
}

function renderSuggestion(
    suggestion: SelectOption,
    { query, isHighlighted }: {isHighlighted: boolean, query: any}
){
    const matches = match(suggestion.label, query);
    const parts = parse(suggestion.label, matches);

    return (
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map((part, index) =>
            part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            ),
          )}
        </div>
      </MenuItem>
    );
}

function getSuggestions(value: string) {
    const inputValue = _.deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : suggestions.filter(suggestion => {
          const keep =
            count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });
}

function getSuggestionValue(suggestion: SelectOption) {
    return suggestion.label;
}

interface Props extends WithStyles<typeof styles> {}

interface State {
    value: string;
    suggestions: SelectOption[]
}


class Search extends React.Component<Props, State> {

    constructor(props: Props) {
		super(props)
		this.state = {
            value: '',
            suggestions: []
		}
    }

    handleSuggestionsFetchRequested = ({ value }: {value: string}) => {
        this.setState({
            suggestions: getSuggestions(value),
        });
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    };

    handleChange = (event: React.FormEvent, { newValue }: { newValue: string }) => {
        this.setState({
            value: newValue,
        });
    };

    onSuggestionSelected = (event: React.FormEvent, data: {suggestion: SelectOption}) => {
        console.log(data.suggestion.value, 'ffff');
    }


    render() {

        const { classes } = this.props

        const autosuggestProps = {
            renderInputComponent,
            suggestions: this.state.suggestions,
            onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
            onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
            onSuggestionSelected: this.onSuggestionSelected,
            getSuggestionValue,
            renderSuggestion,
        };

        return (
            <div className={classes.root}>
                <Autosuggest
                    {...autosuggestProps}
                    inputProps={{
                        classes,
                        placeholder: 'Search',
                        value: this.state.value,
                        onChange: this.handleChange,
                    }}
                    theme={{
                        container: classes.container,
                        suggestionsContainerOpen: classes.suggestionsContainerOpen,
                        suggestionsList: classes.suggestionsList,
                        suggestion: classes.suggestion,
                    }}
                    renderSuggestionsContainer={options => (
                        <Paper {...options.containerProps} square>
                            {options.children}
                        </Paper>
                    )}
                />
            </div>
        );
    }
}

export default withStyles(styles)(Search)