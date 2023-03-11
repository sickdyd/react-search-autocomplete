import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { cleanup, fireEvent, render } from '@testing-library/react'
import Results, { ResultsProps } from '../src/components/Results'

type Item = {
  id: number
  name: string
}

const results: Item[] = [
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

const defaultProps: ResultsProps<Item> = {
  results,
  onClick: () => {},
  highlightedItem: 0,
  setHighlightedItem: () => {},
  showIcon: true,
  maxResults: 10,
  setSearchString: () => {},
  formatResult: undefined,
  resultStringKeyName: 'name',
  showNoResultsFlag: false
}

afterEach(cleanup)

describe('<Results>', () => {
  it('renders results', () => {
    const { container } = render(<Results {...defaultProps} />)
    expect(container.getElementsByClassName('line').length).toBe(1)
    expect(container.getElementsByTagName('li').length).toBe(4)
    expect(container.getElementsByClassName('ellipsis').length).toBe(4)
    expect(container.querySelectorAll('.search-icon').length).toBe(4)
  })

  it('shows no results', () => {
    const { container } = render(<Results {...defaultProps} results={[]} />)
    expect(container.querySelector('.line')).toBe(null)
  })

  it('calls onClick when result is clicked', () => {
    const onClick = jest.fn()
    const { container } = render(<Results {...defaultProps} onClick={onClick} />)
    const liTag = container.getElementsByTagName('li')[0]

    fireEvent.click(liTag)

    expect(onClick).toHaveBeenCalled()
  })

  it('hides the icon if showIcon is false', () => {
    const { container } = render(<Results {...defaultProps} showIcon={false} />)
    expect(container.querySelector('.icon')).toBe(null)
  })

  it('renders only 2 result', () => {
    const { container } = render(<Results {...defaultProps} maxResults={2} />)
    expect(container.getElementsByClassName('line').length).toBe(1)
    expect(container.getElementsByClassName('ellipsis').length).toBe(2)
    expect(container.querySelectorAll('.search-icon').length).toBe(2)
  })

  it('calls setHighlightedItem when result is hovered', () => {
    const setHighlightedItem = jest.fn()

    const { container } = render(
      <Results {...defaultProps} setHighlightedItem={setHighlightedItem} />
    )

    const liTag = container.getElementsByTagName('li')[0]
    fireEvent.mouseEnter(liTag)

    expect(setHighlightedItem).toHaveBeenCalledWith({ index: 0 })
  })

  it('calls formatResult when renders results', () => {
    const formatResult = jest.fn()

    render(<Results {...defaultProps} formatResult={formatResult} />)

    expect(formatResult).toHaveBeenCalledTimes(4)
  })

  it('calls formatResult and render result appropriately', () => {
    const formatResult = (item: Item) => <span className="test-span">{item.name}</span>

    const { container } = render(<Results {...defaultProps} formatResult={formatResult} />)

    const items = container.getElementsByClassName('ellipsis')

    expect(items.length).toBe(4)

    expect(items[0].innerHTML).toMatch('<span class="test-span">value0</span>')
    expect(items[1].innerHTML).toMatch('<span class="test-span">value1</span>')
    expect(items[2].innerHTML).toMatch('<span class="test-span">value2</span>')
    expect(items[3].innerHTML).toMatch('<span class="test-span">value3</span>')
  })
})
