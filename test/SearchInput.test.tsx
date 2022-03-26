import '@testing-library/jest-dom/extend-expect'
import { cleanup, fireEvent, render } from '@testing-library/react'
import React from 'react'
import SearchInput from '../src/components/SearchInput'

afterEach(cleanup)

const defaultProps = {
  autoFocus: false,
  showIcon: true,
  showClear: true,
  placeholder: 'Search',
  setHighlightedItem: () => {},
  setSearchString: () => {},
  searchString: '',
  onFocus: () => {},
  onBlur: () => {},
  onClear: () => {}
}

describe('<SearchInput>', () => {
  it('renders the input box', () => {
    const { queryByPlaceholderText } = render(<SearchInput {...defaultProps} />)
    const inputNode = queryByPlaceholderText(/search/i)
    expect(inputNode).toBeInTheDocument()
  })
  it('calls setSearchString on input change', () => {
    const setSearchString = jest.fn()
    const { queryByPlaceholderText } = render(
      <SearchInput {...defaultProps} setSearchString={setSearchString} />
    )
    const inputNode = queryByPlaceholderText(/search/i)
    fireEvent.change(inputNode, { target: { value: 'Text' } })
    expect(setSearchString).toHaveBeenCalled()
  })
  it('calls onFocus when input is focused', () => {
    const onFocus = jest.fn()
    const { queryByPlaceholderText } = render(<SearchInput {...defaultProps} onFocus={onFocus} />)
    const inputNode = queryByPlaceholderText(/search/i)
    fireEvent.focus(inputNode)
    expect(onFocus).toHaveBeenCalled()
  })
  it('calls onBlur when input loses focus', () => {
    const onBlur = jest.fn()
    const { queryByPlaceholderText } = render(<SearchInput {...defaultProps} onBlur={onBlur} />)
    const inputNode = queryByPlaceholderText(/search/i)
    fireEvent.blur(inputNode)
    expect(onBlur).toHaveBeenCalled()
  })
  it('hides the icon when showIcon is false', () => {
    const { container } = render(<SearchInput {...defaultProps} showIcon={false} />)
    expect(container.querySelectorAll('.search-icon').length).toBe(0)
  })
  it('displays an icon when showIcon is true', () => {
    const { container } = render(<SearchInput {...defaultProps} showIcon={true} />)
    expect(container.querySelectorAll('.search-icon').length).toBe(1)
  })
})
