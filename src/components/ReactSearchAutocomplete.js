import React from 'react'
import PropTypes from 'prop-types'
import Fuse from 'fuse.js'
import { defaultTheme, defaultFuseOptions } from '../config/config'
import Results from './Results'
import SearchInput from './SearchInput'
import { ThemeProvider } from 'styled-components'
import { debounce } from '../utils/utils'
import styled from 'styled-components'

export const DEFAULT_INPUT_DEBOUNCE = 200
export const MAX_RESULTS = 10

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
    resultStringKeyName
  } = props

  const theme = { ...defaultTheme, ...styling }
  const options = { ...defaultFuseOptions, ...fuseOptions }

  const fuse = new Fuse(items, options)

  const [searchString, setSearchString] = React.useState('')
  const [results, setResults] = React.useState()

  React.useEffect(() => {
    if (useCaching) sessionStorage.clear()
    fuse.setCollection(items)
    setResults([])
  }, [items])

  const cacheResults = (keyword, results) =>
    useCaching && sessionStorage.setItem(keyword, JSON.stringify(results))

  const retrieveCachedResults = (keyword) =>
    useCaching && keyword in sessionStorage && JSON.parse(sessionStorage.getItem(keyword))

  const fuseResults = (keyword) =>
    fuse
      .search(keyword, { limit: maxResults })
      .map((result) => ({ ...result.item }))
      .slice(0, maxResults)

  const searchAndSetResults = (keyword) => {
    const results = retrieveCachedResults(keyword?.toLowerCase()) || fuseResults(keyword)
    cacheResults(keyword?.toLowerCase(), results)
    onSearch(keyword, results)
    setResults(results)
  }

  const handleOnSearch = React.useCallback(
    inputDebounce > 0
      ? debounce((keyword) => searchAndSetResults(keyword), inputDebounce)
      : (keyword) => searchAndSetResults(keyword),
    [items]
  )

  const handleSetSearchString = (event) => {
    const keyword = event.target.value
    setSearchString(keyword)
    keyword.length > 0 ? handleOnSearch(keyword) : setResults([])
  }

  return (
    <ThemeProvider theme={theme}>
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
            setSearchString={setSearchString}
            showIcon={showIcon}
            maxResults={maxResults}
            resultStringKeyName={resultStringKeyName}
          />
        </div>
      </StyledReactSearchAutocomplete>
    </ThemeProvider>
  )
}

ReactSearchAutocomplete.defaultProps = {
  items: [],
  fuseOptions: defaultFuseOptions,
  onSearch: () => {},
  useCaching: false,
  inputDebounce: DEFAULT_INPUT_DEBOUNCE,
  showIcon: true,
  maxResults: MAX_RESULTS,
  placeholder: '',
  autoFocus: false,
  styling: {},
  resultStringKeyName: 'name'
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
  resultStringKeyName: PropTypes.string
}

const StyledReactSearchAutocomplete = styled.div`
  position: relative;

  height: ${(props) => parseInt(props.theme.height) + 2 + 'px'};

  > .wrapper {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100%;

    border: ${(props) => props.theme.border};
    border-radius: ${(props) => props.theme.borderRadius};

    background-color: ${(props) => props.theme.backgroundColor};
    color: ${(props) => props.theme.color};

    font-size: ${(props) => props.theme.fontSize};
    font-family: ${(props) => props.theme.fontFamily};

    z-index: ${(props) => props.theme.zIndex};

    &:hover {
      box-shadow: ${(props) => props.theme.boxShadow};
    }
    &:active {
      box-shadow: ${(props) => props.theme.boxShadow};
    }
    &:focus-within {
      box-shadow: ${(props) => props.theme.boxShadow};
    }
  }
`
