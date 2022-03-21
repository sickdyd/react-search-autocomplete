import { default as Fuse } from 'fuse.js'
import React, { ChangeEvent, FocusEventHandler, KeyboardEvent, useEffect, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { defaultFuseOptions, DefaultTheme, defaultTheme } from '../config/config'
import { debounce } from '../utils/utils'
import Results from './Results'
import SearchInput from './SearchInput'

export const DEFAULT_INPUT_DEBOUNCE = 200
export const MAX_RESULTS = 10

export interface ReactSearchAutocompleteProps<T> {
  items: T[]
  fuseOptions?: Fuse.IFuseOptions<T>
  inputDebounce?: number
  onSearch?: (keyword: string, results: T[]) => void
  onHover?: (result: T) => void
  onSelect?: (result: T) => void
  onFocus?: FocusEventHandler<HTMLInputElement>
  onClear?: Function
  showIcon?: boolean
  showClear?: boolean
  maxResults?: number
  placeholder?: string
  autoFocus?: boolean
  styling?: DefaultTheme
  resultStringKeyName?: string
  inputSearchString?: string
  formatResult?: Function
}

export default function ReactSearchAutocomplete<T>({
  items = [],
  fuseOptions = defaultFuseOptions,
  inputDebounce = DEFAULT_INPUT_DEBOUNCE,
  onSearch = () => {},
  onHover = () => {},
  onSelect = () => {},
  onFocus = () => {},
  onClear = () => {},
  showIcon = true,
  showClear = true,
  maxResults = MAX_RESULTS,
  placeholder = '',
  autoFocus = false,
  styling = {},
  resultStringKeyName = 'name',
  inputSearchString = '',
  formatResult
}: ReactSearchAutocompleteProps<T>) {
  const theme = { ...defaultTheme, ...styling }
  const options = { ...defaultFuseOptions, ...fuseOptions }

  const fuse = new Fuse(items, options)
  fuse.setCollection(items)

  const [searchString, setSearchString] = useState<string>(inputSearchString)
  const [results, setResults] = useState<any[]>([])
  const [highlightedItem, setHighlightedItem] = useState<number>(0)

  const callOnSearch = (keyword: string) => {
    let newResults: T[] = []

    keyword?.length > 0 && (newResults = fuseResults(keyword))

    setResults(newResults)
    onSearch(keyword, newResults)
  }

  const handleOnSearch = React.useCallback(
    inputDebounce > 0
      ? debounce((keyword: string) => callOnSearch(keyword), inputDebounce)
      : (keyword) => callOnSearch(keyword),
    [items]
  )

  useEffect(() => {
    setSearchString(inputSearchString)
  }, [inputSearchString])

  useEffect(() => {
    searchString?.length > 0 &&
      results &&
      results?.length > 0 &&
      setResults(fuseResults(searchString))
  }, [items])

  const handleOnClick = (result: T) => {
    setResults([])
    onSelect(result)
    setHighlightedItem(0)
  }

  const fuseResults = (keyword: string) =>
    fuse
      .search(keyword, { limit: maxResults })
      .map((result) => ({ ...result.item }))
      .slice(0, maxResults)

  const handleSetSearchString = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const keyword = target.value
    setSearchString(keyword)
    handleOnSearch(keyword)
  }

  const handleSetHighligthedItem = ({
    index,
    event
  }: {
    index?: number
    event?: KeyboardEvent<HTMLInputElement>
  }) => {
    let itemIndex = 0

    const setValues = (index: number) => {
      setHighlightedItem(index)
      onHover(results[index])
    }

    if (index !== undefined) {
      setHighlightedItem(index)
    } else if (event) {
      switch (event.key) {
        case 'Enter':
          setResults([])
          onSelect(results[highlightedItem])
          setHighlightedItem(0)
          break
        case 'ArrowUp':
          itemIndex = highlightedItem > 0 ? highlightedItem - 1 : results.length - 1
          setValues(itemIndex)
          break
        case 'ArrowDown':
          itemIndex = highlightedItem < results.length - 1 ? highlightedItem + 1 : 0
          setValues(itemIndex)
          break
        default:
          break
      }
    }
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
            onClear={onClear}
            placeholder={placeholder}
            showIcon={showIcon}
            showClear={showClear}
            setHighlightedItem={handleSetHighligthedItem}
          />
          <Results
            results={results}
            onClick={handleOnClick}
            onHover={onHover}
            setSearchString={setSearchString}
            showIcon={showIcon}
            maxResults={maxResults}
            resultStringKeyName={resultStringKeyName}
            formatResult={formatResult}
            highlightedItem={highlightedItem}
            setHighlightedItem={handleSetHighligthedItem}
          />
        </div>
      </StyledReactSearchAutocomplete>
    </ThemeProvider>
  )
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
