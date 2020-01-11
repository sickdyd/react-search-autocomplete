import React from "react";
import PropTypes from "prop-types";
import Fuse from "fuse.js";
import { defaultTheme, GlobalStyle, defaultFuseOptions } from "./defaults/defaults";
import Results from "./Results/Results";
import { StyledReactSearchAutocomplete } from "./StyledReactSearchAutocomplete";
import SearchInput from "./SearchInput/SearchInput";
import { ThemeProvider } from 'styled-components'
import { debounce, isCached } from "./utils/utils";

export default function ReactSearchAutocomplete(props) {

  const {
    items,
    fuseOptions,
    useCaching,
    inputDebounce,
    onSearch,
    onSelect,
    onFocus,
    showIcon,
    maxResults,
    placeholder,
    autoFocus,
    styling,
  } = props;

  const theme = {...defaultTheme, ...styling};
  const options = {...defaultFuseOptions, ...fuseOptions};

  const [searchString, setSearchString] = React.useState("");
  const [results, setResults] = React.useState();

  React.useEffect(() => {
    if (useCaching) sessionStorage.clear();
  }, [items]);

  React.useEffect(() => {

    const keyword = searchString.toLowerCase();

    if (keyword.length > 0) {
      const fuse = new Fuse(items, options);
      const newResults = fuse.search(searchString);
      if (useCaching) {
        if (keyword in sessionStorage) { 
          setResults(JSON.parse(sessionStorage.getItem(keyword)));
        } else {
          sessionStorage.setItem(keyword, JSON.stringify(newResults));
          setResults(newResults);
        }
      } else {
        setResults(newResults);
      }
    } else {
      setResults([]);
    }
  }, [searchString, items, useCaching])

  // This is used to debounce the onSearch props function
  const debounceOnSearch = React.useCallback(
    inputDebounce > 0 ?
      debounce((keyword, cached) => onSearch(keyword, cached), inputDebounce)
    :
      (keyword, cached) => onSearch(keyword, cached), []);

  const handleSetSearchString = event => {
    setSearchString(event.target.value);
    const keyword = event.target.value.toLowerCase();
    if (useCaching) {
      onSearch && debounceOnSearch(event.target.value, isCached(keyword));
    } else {
      onSearch && debounceOnSearch(event.target.value, false);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <StyledReactSearchAutocomplete>
        <div className="wrapper">
          <SearchInput
            searchString={searchString}
            setSearchString={handleSetSearchString}
            autoFocus={autoFocus}
            onBlur={() => setResults([])}
            onFocus={onFocus}
            placeholder={placeholder}
            showIcon={showIcon}
          />
          <Results
            results={results}
            onClick={onSelect}
            showIcon={showIcon}
            maxResults={maxResults}
          />
        </div>
      </StyledReactSearchAutocomplete>
    </ThemeProvider>
  )
}

ReactSearchAutocomplete.defaultProps = {
  items: [],
  fuseOptions: defaultFuseOptions,
  useCaching: true,
  inputDebounce: 200,
  showIcon: true,
  maxResults: 10,
  placeholder: "",
  autoFocus: false,
  styling: {},
}

ReactSearchAutocomplete.propTypes = {
  items: PropTypes.array,
  fuseOptions: PropTypes.object,
  useCaching: PropTypes.bool,
  inputDebounce: PropTypes.number,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
  onFocus: PropTypes.func,
  showIcon: PropTypes.bool,
  maxResults: PropTypes.number,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  styling: PropTypes.object,
}