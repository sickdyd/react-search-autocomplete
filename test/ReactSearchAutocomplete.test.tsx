import React from 'react'
import '@babel/polyfill'
import '@testing-library/jest-dom/extend-expect'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import ReactSearchAutocomplete, {
  DEFAULT_INPUT_DEBOUNCE,
  ReactSearchAutocompleteProps
} from '../src/components/ReactSearchAutocomplete'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

interface Item {
  id: number
  name: string
}

interface ItemWithDescription {
  id: number
  title: string
  description: string
}

describe('<ReactSearchAutocomplete>', () => {
  let items = [
    {
      id: 0,
      name: 'value0'
    },
    {
      id: 1,
      name: 'value1'
    },
    {
      id: 2,
      name: 'value2'
    },
    {
      id: 3,
      name: 'value3'
    }
  ]

  let defaultProps: ReactSearchAutocompleteProps<Item> = {
    items,
    placeholder: 'Search'
  }

  let onSearch = jest.fn()

  beforeEach(() => jest.useFakeTimers())

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the search box', () => {
    const { queryByPlaceholderText, container } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    expect(inputElement!).toBeInTheDocument()
    expect(container.querySelectorAll('.search-icon').length).toBe(1)
    expect(container.getElementsByClassName('wrapper').length).toBe(1)
  })

  it('uses inputSearchString prop', async () => {
    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} inputSearchString="a string" />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    expect(inputElement!).toHaveValue('a string')
  })

  it('updates the value if inputSearchString prop is updated', async () => {
    const { rerender, queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} inputSearchString="a string" />
    )

    expect(queryByPlaceholderText(/search/i)).toHaveValue('a string')

    rerender(<ReactSearchAutocomplete<Item> {...defaultProps} inputSearchString="a new string" />)

    expect(queryByPlaceholderText(/search/i)).toHaveValue('a new string')
  })

  it('display results if inputSearchString prop changes', async () => {
    const { queryByPlaceholderText, queryAllByText } = render(
      <ReactSearchAutocomplete<Item>
        {...defaultProps}
        items={[...items, { id: 4, name: 'some other' }]}
        inputSearchString="value0"
      />
    )

    act(() => {
      jest.advanceTimersByTime(1)
    })

    expect(queryByPlaceholderText(/search/i)).toHaveValue('value0')

    const results = queryAllByText('value0')

    expect(results.length).toBe(1)

    const notDisplayedResults = queryAllByText('some other')

    expect(notDisplayedResults.length).toBe(0)
  })

  it('updates results if items change', async () => {
    const { rerender } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} onSearch={onSearch} />
    )

    const inputElement = screen.queryByPlaceholderText(/search/i)

    fireEvent.change(inputElement!, { target: { value: 'value' } })

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    expect(onSearch).toHaveBeenCalledWith('value', items)

    const newItems = [
      {
        id: 0,
        name: 'another0'
      },
      {
        id: 1,
        name: 'another1'
      },
      {
        id: 2,
        name: 'another2'
      },
      {
        id: 3,
        name: 'another3'
      }
    ]

    onSearch.mockClear()

    rerender(
      <ReactSearchAutocomplete<Item> {...defaultProps} items={newItems} onSearch={onSearch} />
    )

    fireEvent.change(inputElement!, { target: { value: 'another' } })

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    expect(onSearch).toHaveBeenCalledWith('another', newItems)
  })

  it('returns an array of results', async () => {
    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} onSearch={onSearch} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    fireEvent.change(inputElement!, { target: { value: 'value' } })

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    expect(onSearch).toHaveBeenCalledWith('value', items)
  })

  it('returns the items on focus if showItemsOnFocus is true', async () => {
    const { queryByPlaceholderText, container } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} showItemsOnFocus={true} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    fireEvent.focusIn(inputElement!)

    const liTags = container.getElementsByTagName('li')

    expect(liTags.length).toBe(4)
  })

  it('limits the items on focus if showItemsOnFocus is true to maxResults', async () => {
    const { queryByPlaceholderText, container } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} showItemsOnFocus={true} maxResults={2} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    fireEvent.focusIn(inputElement!)

    const liTags = container.getElementsByTagName('li')

    expect(liTags.length).toBe(2)
  })

  it('returns by default the list of items after clearing the input box if showItemsOnFocus is true', async () => {
    const newItems = [
      {
        id: 0,
        name: 'aaa'
      },
      {
        id: 1,
        name: 'bbb'
      },
      {
        id: 2,
        name: 'ccc'
      },
      {
        id: 3,
        name: 'ddd'
      }
    ]

    const { queryByPlaceholderText, container } = render(
      <ReactSearchAutocomplete<Item>
        {...defaultProps}
        onSearch={onSearch}
        showItemsOnFocus={true}
        items={newItems}
      />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    fireEvent.focusIn(inputElement!)

    let liTags = container.getElementsByTagName('li')

    expect(liTags.length).toBe(4)

    fireEvent.change(inputElement!, { target: { value: 'aaa' } })

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    expect(onSearch).toHaveBeenCalledWith('aaa', [{ id: 0, name: 'aaa' }])

    liTags = container.getElementsByTagName('li')

    expect(liTags.length).toBe(1)

    fireEvent.change(inputElement!, { target: { value: '' } })

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    liTags = container.getElementsByTagName('li')

    expect(liTags.length).toBe(4)
  })

  it('returns an array of one result', async () => {
    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} onSearch={onSearch} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    fireEvent.change(inputElement!, { target: { value: '0' } })

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    expect(onSearch).toHaveBeenCalledWith('0', [{ id: 0, name: 'value0' }])
  })

  it('calls onSearch on change', async () => {
    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} onSearch={onSearch} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    fireEvent.change(inputElement!, { target: { value: 'v' } })

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    expect(onSearch).toHaveBeenCalledWith('v', items)
  })

  it('calls onSearch and delete results if text is empty', async () => {
    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} onSearch={onSearch} />
    )

    const inputElement = queryByPlaceholderText(/search/i)
    fireEvent.change(inputElement!, { target: { value: 'v' } })
    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    expect(onSearch).toHaveBeenNthCalledWith(1, 'v', items)

    fireEvent.change(inputElement!, { target: { value: '' } })
    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    expect(onSearch).toHaveBeenNthCalledWith(2, '', [])
  })

  it('calls onHover when result is hovered', () => {
    const onHover = jest.fn()

    const { container, queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} onHover={onHover} />
    )

    const inputElement = queryByPlaceholderText(/search/i)
    fireEvent.change(inputElement!, { target: { value: 'v' } })
    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    const liTag = container.getElementsByTagName('li')[0]

    fireEvent.mouseEnter(liTag)

    expect(onHover).toHaveBeenCalledWith(items[0])
  })

  it('does not call onHover when using arrows and no results are visible', () => {
    const onHover = jest.fn()

    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} onHover={onHover} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    for (let i = 0; i < 10; i++) {
      fireEvent.keyDown(inputElement!, {
        key: 'ArrowDown',
        code: 'ArrowDown',
        keyCode: 40,
        charCode: 40
      })

      act(() => {
        jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
      })

      expect(onHover).not.toHaveBeenCalled()
    }
  })

  it('change selected element when ArrowDown is pressed', () => {
    const onHover = jest.fn()

    const { container, queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} onHover={onHover} />
    )

    const inputElement = queryByPlaceholderText(/search/i)
    fireEvent.change(inputElement!, { target: { value: 'v' } })
    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    fireEvent.keyDown(inputElement!, {
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: 40,
      charCode: 40
    })

    const liTag0 = container.getElementsByTagName('li')[0]
    expect(liTag0).toHaveClass('selected')

    fireEvent.keyDown(inputElement!, {
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: 40,
      charCode: 40
    })

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })
    expect(liTag0).not.toHaveClass('selected')

    const liTag1 = container.getElementsByTagName('li')[1]
    expect(liTag1).toHaveClass('selected')
  })

  it('calls onSelect when key navigating down and pressing return', () => {
    const onSelect = jest.fn()

    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} onSelect={onSelect} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    fireEvent.change(inputElement!, { target: { value: 'v' } })

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    fireEvent.keyDown(inputElement!, {
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: 40,
      charCode: 40
    })

    fireEvent.keyDown(inputElement!, {
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: 40,
      charCode: 40
    })

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    fireEvent.keyDown(inputElement!, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13
    })

    expect(onSelect).toHaveBeenCalledWith(items[1])
  })

  it('calls onSearch when key navigating and pressing return when no eleemnt is highlighted', () => {
    const onSearch = jest.fn()

    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} onSearch={onSearch} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    const searchString = 'val'

    fireEvent.change(inputElement!, { target: { value: searchString } })

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    for (let i = 0; i < items.length + 1; i++) {
      fireEvent.keyDown(inputElement!, {
        key: 'ArrowDown',
        code: 'ArrowDown',
        keyCode: 40,
        charCode: 40
      })

      act(() => {
        jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
      })
    }

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    fireEvent.keyDown(inputElement!, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13
    })

    expect(onSearch).toHaveBeenCalledWith(searchString, defaultProps.items)
  })

  it('sets the value of the input to the selected item when pressing return', () => {
    const { queryByPlaceholderText } = render(<ReactSearchAutocomplete<Item> {...defaultProps} />)

    const inputElement = queryByPlaceholderText(/search/i)

    fireEvent.change(inputElement!, { target: { value: 'v' } })

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    fireEvent.keyDown(inputElement!, {
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: 40,
      charCode: 40
    })

    fireEvent.keyDown(inputElement!, {
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: 40,
      charCode: 40
    })

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    fireEvent.keyDown(inputElement!, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13
    })

    expect(inputElement!).toHaveDisplayValue(items[1].name)
  })

  it('sets the value of the input to the selected item when clicking on it', () => {
    const { container, queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} />
    )

    const inputElement = queryByPlaceholderText(/search/i)
    fireEvent.change(inputElement!, { target: { value: 'v' } })
    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    const liTag = container.getElementsByTagName('li')[0]
    fireEvent.click(liTag)

    expect(inputElement!).toHaveDisplayValue(items[0].name)
  })

  it('calls onSelect when ciclying and pressing return', () => {
    const onSelect = jest.fn()

    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} onSelect={onSelect} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    fireEvent.change(inputElement!, { target: { value: 'v' } })
    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    for (let i = 0; i < items.length + 2; i++) {
      fireEvent.keyDown(inputElement!, {
        key: 'ArrowDown',
        code: 'ArrowDown',
        keyCode: 40,
        charCode: 40
      })

      act(() => {
        jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
      })
    }

    fireEvent.keyDown(inputElement!, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13
    })

    expect(onSelect).toHaveBeenCalledWith(items[0])
  })

  it('calls onSelect when clicking on item', () => {
    const onSelect = jest.fn()

    const { queryByPlaceholderText, queryAllByTitle, queryByText, container } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} onSelect={onSelect} />
    )

    let inputElement = queryByPlaceholderText(/search/i) as HTMLInputElement

    fireEvent.change(inputElement!, { target: { value: 'v' } })

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    const liNode = queryAllByTitle('value0')[0]

    fireEvent.click(liNode)

    expect(onSelect).toHaveBeenCalledWith({ id: 0, name: 'value0' })

    expect(inputElement!.value).toBe('value0')
  })

  it('does not display results again after selection if items changes', () => {
    const onSelect = jest.fn()

    const { queryByPlaceholderText, queryAllByTitle, container } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} onSelect={onSelect} />
    )

    const inputElement = queryByPlaceholderText(/search/i) as HTMLInputElement

    fireEvent.change(inputElement!, { target: { value: 'v' } })

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    const liElement = queryAllByTitle('value0')[0]

    fireEvent.click(liElement)

    expect(onSelect).toHaveBeenCalledWith({ id: 0, name: 'value0' })

    expect(inputElement!.value).toBe('value0')

    const newItems = [
      {
        id: 0,
        name: 'another0'
      },
      {
        id: 1,
        name: 'another1'
      },
      {
        id: 2,
        name: 'another2'
      },
      {
        id: 3,
        name: 'another3'
      }
    ]

    render(
      <ReactSearchAutocomplete<Item> {...defaultProps} items={newItems} onSelect={onSelect} />,
      {
        container
      }
    )

    const liElements = container.querySelectorAll('[data-test="result"]')

    expect(liElements.length).toBe(0)
  })

  it('calls onFocus on input focus', () => {
    const onFocus = jest.fn()

    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} onFocus={onFocus} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    fireEvent.focus(inputElement!)

    expect(onFocus).toHaveBeenCalled()
  })

  it('sets focus if autoFocus is true', () => {
    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} autoFocus={true} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    expect(inputElement!).toHaveFocus()
  })

  it('uses debounce on search', () => {
    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} onSearch={onSearch} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    for (let i = 0; i < 10; i++) {
      fireEvent.change(inputElement!, { target: { value: Math.random() } })
    }

    act(() => {
      jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
    })

    expect(onSearch).toBeCalledTimes(1)
  })

  it("doesn't use debounce if inputDebounce is 0", () => {
    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete<Item> {...defaultProps} onSearch={onSearch} inputDebounce={0} />
    )

    onSearch.mockClear()

    const inputElement = queryByPlaceholderText(/search/i)

    for (let i = 0; i < 10; i++) {
      fireEvent.change(inputElement!, { target: { value: Math.random() } })
    }

    expect(onSearch).toBeCalledTimes(10)
  })

  describe('with items with name property', () => {
    it('renders the search box', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete<Item> {...defaultProps} />
      )
      const inputElement = queryByPlaceholderText(/search/i)
      // check that the input node is present
      expect(inputElement!).toBeInTheDocument()
      // check that the icon is present
      expect(container.querySelectorAll('.search-icon').length).toBe(1)
      // check that wrapper div is present
      expect(container.getElementsByClassName('wrapper').length).toBe(1)
    })

    it('shows 4 matching items', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete<Item> {...defaultProps} />
      )

      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement!, { target: { value: 'v' } })

      act(() => {
        jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
      })

      const ul = container.getElementsByTagName('ul')[0]
      expect(ul.getElementsByTagName('li').length).toBe(4)
      expect(ul.querySelectorAll('.search-icon').length).toBe(4)
    })

    it('shows 1 matching item', () => {
      const { queryByPlaceholderText, queryAllByTitle, container } = render(
        <ReactSearchAutocomplete<Item> {...defaultProps} />
      )

      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement!, { target: { value: '0' } })

      act(() => {
        jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
      })

      expect(queryAllByTitle('value0').length).toBe(1)
      const ul = container.getElementsByTagName('ul')[0]
      expect(ul.getElementsByTagName('li').length).toBe(1)
      expect(ul.querySelectorAll('.search-icon').length).toBe(1)
    })

    it('by default shows no results message if there are no matching items', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete<Item> {...defaultProps} />
      )

      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement!, { target: { value: 'something' } })

      act(() => {
        jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
      })

      let liElements = container.querySelectorAll('[data-test="result"]')

      expect(liElements.length).toBe(0)

      liElements = container.querySelectorAll('[data-test="no-results-message"]')

      expect(liElements.length).toBe(1)
      expect(liElements[0].textContent).toBe('No results')
    })

    it('shows nothing if showNoResults is false', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete<Item> {...defaultProps} showNoResults={false} />
      )

      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement!, { target: { value: 'something' } })

      act(() => {
        jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
      })

      let liElements = container.querySelectorAll('[data-test="result"]')

      expect(liElements.length).toBe(0)

      liElements = container.querySelectorAll('[data-test="no-results-message"]')

      expect(liElements.length).toBe(0)
    })

    it('shows custom no results message if no results are found', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete<Item>
          {...defaultProps}
          showNoResultsText="We could not find any matching items"
        />
      )

      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement!, { target: { value: 'something' } })

      act(() => {
        jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
      })

      let liElements = container.querySelectorAll('[data-test="result"]')

      expect(liElements.length).toBe(0)

      liElements = container.querySelectorAll('[data-test="no-results-message"]')

      expect(liElements.length).toBe(1)
      expect(liElements[0].textContent).toBe('We could not find any matching items')
    })
  })

  describe('with items with custom properties property', () => {
    const items = [
      {
        id: 0,
        title: 'Titanic',
        description: 'A movie about love'
      },
      {
        id: 1,
        title: 'Dead Poets Society',
        description: 'A movie about poetry and the meaning of life'
      },
      {
        id: 2,
        title: 'Terminator 2',
        description: 'A robot from the future is sent back in time'
      },
      {
        id: 3,
        title: 'Alien 2',
        description: 'Ripley is back for a new adventure'
      }
    ]

    const defaultProps = {
      items: items,
      placeholder: 'Search',
      onSearch: () => {},
      fuseOptions: { keys: ['title', 'description'] },
      resultStringKeyName: 'title'
    }

    it('shows 4 matching items', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete<ItemWithDescription> {...defaultProps} />
      )

      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement!, { target: { value: 'a' } })

      act(() => {
        jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
      })

      const ul = container.getElementsByTagName('ul')[0]
      expect(ul.getElementsByTagName('li').length).toBe(4)
      expect(ul.querySelectorAll('.search-icon').length).toBe(4)
    })

    it('shows 1 matching item', () => {
      const { queryByPlaceholderText, queryAllByTitle, container } = render(
        <ReactSearchAutocomplete<ItemWithDescription> {...defaultProps} />
      )

      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement!, { target: { value: 'dead' } })

      act(() => {
        jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
      })

      expect(queryAllByTitle('Dead Poets Society').length).toBe(1)
      const ul = container.getElementsByTagName('ul')[0]
      expect(ul.getElementsByTagName('li').length).toBe(1)
      expect(ul.querySelectorAll('.search-icon').length).toBe(1)
    })

    it('shows 0 matching item', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete<ItemWithDescription> {...defaultProps} />
      )

      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement!, { target: { value: 'despaira' } })

      act(() => {
        jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
      })

      let liElements = container.querySelectorAll('[data-test="result"]')

      expect(liElements.length).toBe(0)

      liElements = container.querySelectorAll('[data-test="no-results-message"]')

      expect(liElements.length).toBe(1)
    })
  })

  describe('with many items', () => {
    const items = [...new Array(10000)].map((_, i) => {
      return {
        id: i,
        title: `something${i}`,
        description:
          'A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array. Calls a defined callback function on each element of an array, and returns an array that contains the results.'
      }
    })

    const defaultProps = {
      items: items,
      placeholder: 'Search',
      onSearch: () => {},
      fuseOptions: { keys: ['title', 'description'] },
      resultStringKeyName: 'title'
    }

    it('renders and display resulst', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete<ItemWithDescription> {...defaultProps} />
      )

      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement!, { target: { value: 'something' } })

      act(() => {
        jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
      })

      const ul = container.getElementsByTagName('ul')[0]
      expect(ul.getElementsByTagName('li').length).toBe(10)
      expect(ul.querySelectorAll('.search-icon').length).toBe(10)
    })
  })

  describe('showClear', () => {
    it('displays the showClear by default', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete<Item> {...defaultProps} />
      )
      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement!, { target: { value: 'something' } })

      act(() => {
        jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
      })

      const clearIcon = container.querySelector('.clear-icon')
      expect(clearIcon).toBeInTheDocument()
    })

    it('displays the clear icon when showClear is true', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete<Item> {...defaultProps} showClear={true} />
      )
      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement!, { target: { value: 'something' } })

      act(() => {
        jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
      })

      const clearIcon = container.querySelector('.clear-icon')
      expect(clearIcon).toBeInTheDocument()
    })

    it('hides the clear icon when showClear is false', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete<Item> {...defaultProps} showClear={false} />
      )
      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement!, { target: { value: 'something' } })

      act(() => {
        jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
      })

      const clearIcon = container.querySelector('.clear-icon')
      expect(clearIcon).not.toBeInTheDocument()
    })

    it('clears the text, sets focus and calls onClear when the clear icon is clicked', () => {
      const onClear = jest.fn()
      const onFocus = jest.fn()

      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete<Item> {...defaultProps} onClear={onClear} onFocus={onFocus} />
      )
      const inputElement = queryByPlaceholderText(/search/i) as HTMLInputElement

      fireEvent.change(inputElement!, { target: { value: 'something' } })

      act(() => {
        jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE)
      })

      expect(inputElement!.value).toBe('something')

      const clearIcon = container.querySelector('.clear-icon')
      fireEvent.click(clearIcon!)

      expect(inputElement!.value).toBe('')
      expect(inputElement!).toHaveFocus()
      // Since the focus is set programmatically, skip the callback call
      expect(onFocus).not.toHaveBeenCalled()
      expect(onClear).toHaveBeenCalled()
    })
  })
})
