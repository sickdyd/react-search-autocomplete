import React from 'react'
import PropTypes from 'prop-types'
import { SearchIcon } from './SearchIcon'
import styled from 'styled-components'

export default function SearchInput(props) {
  const { searchString, setSearchString, autoFocus, onBlur, onFocus, placeholder, showIcon } = props

  return (
    <StyledSearchInput>
      {showIcon && <SearchIcon />}
      <input
        spellCheck={false}
        value={searchString}
        onChange={setSearchString}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </StyledSearchInput>
  )
}

SearchInput.defaultProps = {
  showIcon: true
}

SearchInput.propTypes = {
  searchString: PropTypes.string.isRequired,
  setSearchString: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  showIcon: PropTypes.bool
}

const StyledSearchInput = styled.div`
  min-height: ${(props) => props.theme.height};
  width: 100%;

  display: flex;
  align-items: center;

  > input {
    width: 100%;

    padding: 0 0 0 13px;

    border: none;
    outline: none;

    background-color: rgba(0, 0, 0, 0);
    font-size: inherit;
    font-family: inherit;

    color: ${(props) => props.theme.color};
  }

  > svg {
    flex-shrink: 0;
    margin-left: 16px;
    fill: ${(props) => props.theme.iconColor};
  }
`
