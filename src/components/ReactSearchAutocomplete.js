import React from 'react'
import PropTypes from 'prop-types'
import Fuse from 'fuse.js'
import { defaultTheme, GlobalStyle, defaultFuseOptions } from '../config/config'
import Results from './Results'
import SearchInput from './SearchInput'
import { ThemeProvider } from 'styled-components'
import { debounce, isCached } from '../utils/utils'
import styled from 'styled-components'

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

  const [searchString, setSearchString] = React.useState('')
  const [results, setResults] = React.useState()

  React.useEffect(() => {
    if (useCaching) sessionStorage.clear()
  }, [items])

  React.useEffect(() => {
    const keyword = searchString?.toLowerCase()

    if (keyword?.length > 0) {
      const fuse = new Fuse(items, options)
      const newResults = fuse
        .search(searchString)
        .map((result) => ({ ...result.item }))
        .slice(0, maxResults)

      useCaching
        ? debounceOnSearch(searchString, isCached(keyword), newResults)
        : debounceOnSearch(searchString, [], newResults)

      if (useCaching) {
        if (keyword in sessionStorage) {
          setResults(JSON.parse(sessionStorage.getItem(keyword)))
        } else {
          sessionStorage.setItem(keyword, JSON.stringify(newResults))
          setResults(newResults)
        }
      } else {
        setResults(newResults)
      }
    } else {
      setResults([])
    }
  }, [searchString, items, useCaching])

  // This is used to debounce the onSearch props function
  const debounceOnSearch = React.useCallback(
    inputDebounce > 0
      ? debounce((keyword, cached, results) => onSearch(keyword, cached, results), inputDebounce)
      : (keyword, cached, results) => onSearch(keyword, cached, results),
    []
  )

  const handleSetSearchString = (event) => {
    setSearchString(event.target.value)
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
  inputDebounce: 200,
  showIcon: true,
  maxResults: 10,
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
