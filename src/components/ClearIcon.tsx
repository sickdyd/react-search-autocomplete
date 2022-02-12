import styled from 'styled-components'

export const ClearIcon = ({
  showClear,
  setSearchString,
  searchString,
  setFocus,
  onClear
}: {
  showClear: boolean
  setSearchString: Function
  searchString: string
  setFocus: Function
  onClear: Function
}) => {
  const handleClearSearchString = () => {
    setSearchString({ target: { value: '' } })
    setFocus()
    onClear()
  }

  if (!showClear) {
    return null
  }

  if (searchString.length <= 0) {
    return null
  }

  return (
    <StyledClearIcon className="clear-icon" onClick={handleClearSearchString}>
      <svg
        width={20}
        height={20}
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.58 12 5 17.58 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
      </svg>
    </StyledClearIcon>
  )
}

const StyledClearIcon = styled.div`
  margin: ${(props) => props.theme.clearIconMargin};

  &:hover {
    cursor: pointer;
  }

  > svg {
    fill: ${(props) => props.theme.iconColor};
  }
`
