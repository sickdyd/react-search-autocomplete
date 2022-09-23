import { default as Fuse } from 'fuse.js'
import React, {
  ChangeEvent,
  FocusEvent,
  FocusEventHandler,
  KeyboardEvent,
  useEffect,
  useState
} from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { defaultFuseOptions, DefaultTheme, defaultTheme } from '../config/config'
import { debounce } from '../utils/utils'
import Results, { Item } from './Results'
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
  showNoResults?: boolean
  showNoResultsText?: string
  showItemsOnFocus?: boolean
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
  formatResult,
  showNoResults = true,
  showNoResultsText = 'No results',
  showItemsOnFocus = false
}: ReactSearchAutocompleteProps<T>) {
  const theme = { ...defaultTheme, ...styling }
  const options = { ...defaultFuseOptions, ...fuseOptions }

  const fuse = new Fuse(items, options)
  fuse.setCollection(items)

  const [searchString, setSearchString] = useState<string>(inputSearchString)
  const [results, setResults] = useState<any[]>([])
  const [highlightedItem, setHighlightedItem] = useState<number>(0)
  const [isSearchComplete, setIsSearchComplete] = useState<boolean>(false)
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [showNoResultsFlag, setShowNoResultsFlag] = useState<boolean>(false)
  const [hasFocus, setHasFocus] = useState<boolean>(false)

  useEffect(() => {
    setSearchString(inputSearchString)
    const timeoutId = setTimeout(() => setResults(fuseResults(inputSearchString)), 0)

    return () => clearTimeout(timeoutId)
  }, [inputSearchString])

  useEffect(() => {
    searchString?.length > 0 &&
      results &&
      results?.length > 0 &&
      setResults(fuseResults(searchString))
  }, [items])

  useEffect(() => {
    if (
      showNoResults &&
      searchString.length > 0 &&
      !isTyping &&
      results.length === 0 &&
      !isSearchComplete
    ) {
      setShowNoResultsFlag(true)
    } else {
      setShowNoResultsFlag(false)
    }
  }, [isTyping, showNoResults, isSearchComplete, searchString, results])

  useEffect(() => {
    if (showItemsOnFocus && results.length === 0 && searchString.length === 0 && hasFocus) {
      setResults(items.slice(0, maxResults))
    }
  }, [showItemsOnFocus, results, searchString, hasFocus])

  useEffect(() => {
    const handleDocumentClick = () => {
      eraseResults()
      setHasFocus(false)
    }

    document.addEventListener('click', handleDocumentClick)

    return () => document.removeEventListener('click', handleDocumentClick)
  }, [])

  const handleOnFocus = (event: FocusEvent<HTMLInputElement>) => {
    onFocus(event)
    setHasFocus(true)
  }

  const callOnSearch = (keyword: string) => {
    let newResults: T[] = []

    keyword?.length > 0 && (newResults = fuseResults(keyword))

    setResults(newResults)
    onSearch(keyword, newResults)
    setIsTyping(false)
  }

  const handleOnSearch = React.useCallback(
    inputDebounce > 0
      ? debounce((keyword: string) => callOnSearch(keyword), inputDebounce)
      : (keyword) => callOnSearch(keyword),
    [items]
  )

  const handleOnClick = (result: Item<T>) => {
    eraseResults()
    onSelect(result)
    setSearchString(result[resultStringKeyName])
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
    setIsTyping(true)

    if (isSearchComplete) {
      setIsSearchComplete(false)
    }
  }

  const eraseResults = () => {
    setResults([])
    setIsSearchComplete(true)
  }

  const handleSetHighlightedItem = ({
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
      onHover(results[index])
    } else if (event) {
      switch (event.key) {
        case 'Enter':
          if (results.length > 0) {
            event.preventDefault()
            onSelect(results[highlightedItem])
            setSearchString(results[highlightedItem][resultStringKeyName])
            setHighlightedItem(0)
          }
          eraseResults()
          break
        case 'ArrowUp':
          event.preventDefault()
          itemIndex = highlightedItem > 0 ? highlightedItem - 1 : results.length - 1
          setValues(itemIndex)
          break
        case 'ArrowDown':
          event.preventDefault()
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
            onFocus={handleOnFocus}
            onClear={onClear}
            placeholder={placeholder}
            showIcon={showIcon}
            showClear={showClear}
            setHighlightedItem={handleSetHighlightedItem}
          />
          <Results
            results={results}
            onClick={handleOnClick}
            setSearchString={setSearchString}
            showIcon={showIcon}
            maxResults={maxResults}
            resultStringKeyName={resultStringKeyName}
            formatResult={formatResult}
            highlightedItem={highlightedItem}
            setHighlightedItem={handleSetHighlightedItem}
            showNoResultsFlag={showNoResultsFlag}
            showNoResultsText={showNoResultsText}
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
