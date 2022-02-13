import styled from 'styled-components'
import { SearchIcon } from './SearchIcon'

type Item<T> = T & { [key: string]: unknown }

export interface ResultsProps<T> {
  results: Item<T>[]
  onClick: Function
  onHover: (result: Item<T>) => void
  setSearchString: Function
  formatResult?: Function
  showIcon: boolean
  maxResults: number
  resultStringKeyName: string
}

export default function Results<T>({
  results = [] as any,
  onClick,
  setSearchString,
  showIcon,
  maxResults,
  resultStringKeyName = 'name',
  onHover,
  formatResult
}: ResultsProps<T>) {
  type WithStringKeyName = T & Record<string, unknown>

  const formatResultWithKey = formatResult
    ? formatResult
    : (item: WithStringKeyName) => item[resultStringKeyName]

  const handleClick = (result: WithStringKeyName) => {
    onClick(result)
    setSearchString(result[resultStringKeyName])
  }

  if (results?.length <= 0) {
    return null
  }

  return (
    <StyledResults>
      <div className="line" />
      <ul>
        {results.slice(0, maxResults).map((result) => (
          <li
            onMouseEnter={() => onHover(result)}
            data-test="result"
            key={`rsa-result-${result.id}`}
            onMouseDown={() => handleClick(result)}
            onClick={() => handleClick(result)}
          >
            <SearchIcon showIcon={showIcon} />
            <div className="ellipsis" title={result[resultStringKeyName] as string}>
              {formatResultWithKey(result)}
            </div>
          </li>
        ))}
      </ul>
    </StyledResults>
  )
}

const StyledResults = styled.div`
  > div.line {
    border-top-color: ${(props) => props.theme.lineColor};
    border-top-style: solid;
    border-top-width: 1px;

    margin-bottom: 0px;
    margin-left: 14px;
    margin-right: 20px;
    margin-top: 0px;

    padding-bottom: 4px;
  }

  > ul {
    list-style-type: none;
    margin: 0;
    padding: 0px 0 16px 0;
    max-height: ${(props) => props.theme.maxHeight};

    > li {
      display: flex;
      align-items: center;
      padding: 4px 0 4px 0;

      &:hover {
        background-color: ${(props) => props.theme.hoverBackgroundColor};
        cursor: default;
      }

      > div {
        margin-left: 13px;
      }
    }
  }

  .ellipsis {
    text-align: left;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
