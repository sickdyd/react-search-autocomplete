import React from 'react'
import '@babel/polyfill'
import { fireEvent, cleanup, render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ReactSearchAutocomplete, { DEFAULT_INPUT_DEBOUNCE } from './ReactSearchAutocomplete'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

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

  let defaultProps = {
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
      <ReactSearchAutocomplete {...defaultProps} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    expect(inputElement).toBeInTheDocument()
    expect(container.querySelectorAll('.search-icon').length).toBe(1)
    expect(container.getElementsByClassName('wrapper').length).toBe(1)
  })

  it('uses inputSearchString prop', async () => {
    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete {...defaultProps} inputSearchString="a string" />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    expect(inputElement).toHaveValue('a string')
  })

  it('updates the value if inputSearchString prop is updated', async () => {
    const { rerender, queryByPlaceholderText } = render(
      <ReactSearchAutocomplete {...defaultProps} inputSearchString="a string" />
    )

    expect(queryByPlaceholderText(/search/i)).toHaveValue('a string')

    rerender(<ReactSearchAutocomplete {...defaultProps} inputSearchString="a new string" />)

    expect(queryByPlaceholderText(/search/i)).toHaveValue('a new string')
  })

  it('updates results if items change', async () => {
    const { rerender } = render(<ReactSearchAutocomplete {...defaultProps} onSearch={onSearch} />)

    const inputElement = screen.queryByPlaceholderText(/search/i)

    fireEvent.change(inputElement, { target: { value: 'value' } })

    act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

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

    rerender(<ReactSearchAutocomplete {...defaultProps} items={newItems} onSearch={onSearch} />)

    fireEvent.change(inputElement, { target: { value: 'another' } })

    act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

    expect(onSearch).toHaveBeenCalledWith('another', newItems)
  })

  it('returns an array of results', async () => {
    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete {...defaultProps} onSearch={onSearch} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    fireEvent.change(inputElement, { target: { value: 'value' } })

    act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

    expect(sessionStorage.getItem).not.toHaveBeenCalled()
    expect(sessionStorage.setItem).not.toHaveBeenCalled()
    expect(onSearch).toHaveBeenCalledWith('value', items)
  })

  it('returns an array of one result', async () => {
    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete {...defaultProps} onSearch={onSearch} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    fireEvent.change(inputElement, { target: { value: '0' } })

    act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

    expect(sessionStorage.getItem).not.toHaveBeenCalled()
    expect(sessionStorage.setItem).not.toHaveBeenCalled()
    expect(onSearch).toHaveBeenCalledWith('0', [{ id: 0, name: 'value0' }])
  })

  it('calls onSearch on change', async () => {
    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete {...defaultProps} onSearch={onSearch} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    fireEvent.change(inputElement, { target: { value: 'v' } })

    act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

    expect(onSearch).toHaveBeenCalledWith('v', items)
  })

  it('calls onSelect on item selection', () => {
    const onSelect = jest.fn()

    const { queryByPlaceholderText, queryAllByTitle } = render(
      <ReactSearchAutocomplete {...defaultProps} onSelect={onSelect} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    fireEvent.change(inputElement, { target: { value: 'v' } })

    act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

    const liNode = queryAllByTitle('value0')[0]

    fireEvent.mouseDown(liNode)

    expect(onSelect).toHaveBeenCalled()
  })

  it('does not display results again after selection if items changes', () => {
    const onSelect = jest.fn()

    const { queryByPlaceholderText, queryAllByTitle, container } = render(
      <ReactSearchAutocomplete {...defaultProps} onSelect={onSelect} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    fireEvent.change(inputElement, { target: { value: 'v' } })

    act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

    let liNode = queryAllByTitle('value0')[0]

    fireEvent.mouseDown(liNode)

    expect(onSelect).toHaveBeenCalled()

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

    render(<ReactSearchAutocomplete {...defaultProps} items={newItems} onSelect={onSelect} />, {
      container
    })

    liNode = container.querySelectorAll('[data-test="result"]')
    expect(liNode.length).toBe(0)
  })

  it('calls onFocus on input focus', () => {
    const onFocus = jest.fn()

    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete {...defaultProps} onFocus={onFocus} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    fireEvent.focus(inputElement)

    expect(onFocus).toHaveBeenCalled()
  })

  it('sets focus if autoFocus is true', () => {
    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete {...defaultProps} autoFocus={true} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    expect(inputElement).toHaveFocus()
  })

  it('uses debounce on search', () => {
    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete {...defaultProps} onSearch={onSearch} />
    )

    const inputElement = queryByPlaceholderText(/search/i)

    for (let i = 0; i < 10; i++) {
      fireEvent.change(inputElement, { target: { value: Math.random() } })
    }

    act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

    expect(onSearch).toBeCalledTimes(1)
  })

  it("doesn't use debounce if inputDebounce is 0", () => {
    const { queryByPlaceholderText } = render(
      <ReactSearchAutocomplete {...defaultProps} onSearch={onSearch} inputDebounce={0} />
    )

    onSearch.mockClear()

    const inputElement = queryByPlaceholderText(/search/i)

    for (let i = 0; i < 10; i++) {
      fireEvent.change(inputElement, { target: { value: Math.random() } })
    }

    expect(onSearch).toBeCalledTimes(10)
  })

  describe('with items with name property', () => {
    it('renders the search box', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete {...defaultProps} />
      )
      const inputElement = queryByPlaceholderText(/search/i)
      // check that the input node is present
      expect(inputElement).toBeInTheDocument()
      // check that the icon is present
      expect(container.querySelectorAll('.search-icon').length).toBe(1)
      // check that wrapper div is present
      expect(container.getElementsByClassName('wrapper').length).toBe(1)
    })

    it('shows 4 matching items', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete {...defaultProps} />
      )

      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement, { target: { value: 'v' } })

      act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

      const ul = container.getElementsByTagName('ul')[0]
      expect(ul.getElementsByTagName('li').length).toBe(4)
      expect(ul.querySelectorAll('.search-icon').length).toBe(4)
    })

    it('shows 1 matching item', () => {
      const { queryByPlaceholderText, queryAllByTitle, container } = render(
        <ReactSearchAutocomplete {...defaultProps} />
      )

      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement, { target: { value: '0' } })

      act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

      expect(queryAllByTitle('value0').length).toBe(1)
      const ul = container.getElementsByTagName('ul')[0]
      expect(ul.getElementsByTagName('li').length).toBe(1)
      expect(ul.querySelectorAll('.search-icon').length).toBe(1)
    })

    it('shows 0 matching items', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete {...defaultProps} />
      )

      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement, { target: { value: 'something' } })

      act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

      expect(container.getElementsByTagName('ul').length).toBe(0)
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
        <ReactSearchAutocomplete {...defaultProps} />
      )

      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement, { target: { value: 'a' } })

      act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

      const ul = container.getElementsByTagName('ul')[0]
      expect(ul.getElementsByTagName('li').length).toBe(4)
      expect(ul.querySelectorAll('.search-icon').length).toBe(4)
    })

    it('shows 1 matching item', () => {
      const { queryByPlaceholderText, queryAllByTitle, container } = render(
        <ReactSearchAutocomplete {...defaultProps} />
      )

      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement, { target: { value: 'dead' } })

      act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

      expect(queryAllByTitle('Dead Poets Society').length).toBe(1)
      const ul = container.getElementsByTagName('ul')[0]
      expect(ul.getElementsByTagName('li').length).toBe(1)
      expect(ul.querySelectorAll('.search-icon').length).toBe(1)
    })

    it('shows 0 matching item', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete {...defaultProps} />
      )

      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement, { target: { value: 'despaira' } })

      act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

      expect(container.getElementsByTagName('ul').length).toBe(0)
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
        <ReactSearchAutocomplete {...defaultProps} />
      )

      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement, { target: { value: 'something' } })

      act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

      const ul = container.getElementsByTagName('ul')[0]
      expect(ul.getElementsByTagName('li').length).toBe(10)
      expect(ul.querySelectorAll('.search-icon').length).toBe(10)
    })
  })

  describe('showClear', () => {
    it('displays the showClear by default', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete {...defaultProps} />
      )
      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement, { target: { value: 'something' } })

      act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

      const clearIcon = container.querySelector('.clear-icon')
      expect(clearIcon).toBeInTheDocument()
    })

    it('displays the clear icon when showClear is true', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete {...defaultProps} showClear={true} />
      )
      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement, { target: { value: 'something' } })

      act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

      const clearIcon = container.querySelector('.clear-icon')
      expect(clearIcon).toBeInTheDocument()
    })

    it('hides the clear icon when showClear is false', () => {
      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete {...defaultProps} showClear={false} />
      )
      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement, { target: { value: 'something' } })

      act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

      const clearIcon = container.querySelector('.clear-icon')
      expect(clearIcon).not.toBeInTheDocument()
    })

    it('clears the text, sets focus and calls onClear when the clear icon is clicked', () => {
      const onClear = jest.fn()
      const onFocus = jest.fn()

      const { queryByPlaceholderText, container } = render(
        <ReactSearchAutocomplete {...defaultProps} onClear={onClear} onFocus={onFocus} />
      )
      const inputElement = queryByPlaceholderText(/search/i)

      fireEvent.change(inputElement, { target: { value: 'something' } })

      act(() => jest.advanceTimersByTime(DEFAULT_INPUT_DEBOUNCE))

      expect(inputElement.value).toBe('something')

      const clearIcon = container.querySelector('.clear-icon')
      fireEvent.click(clearIcon)

      expect(inputElement.value).toBe('')
      expect(inputElement).toHaveFocus()
      // Since the focus is set programmatically, skip the callback call
      expect(onFocus).not.toHaveBeenCalled()
      expect(onClear).toHaveBeenCalled()
    })
  })
})
