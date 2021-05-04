import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { SearchIcon } from './SearchIcon'
import styled from 'styled-components'
import { ClearIcon } from './ClearIcon'

export default function SearchInput({
  searchString,
  setSearchString,
  autoFocus,
  onBlur,
  onFocus,
  onClear,
  placeholder,
  showIcon,
  showClear
}) {
  const ref = useRef()
  let manualFocus = true

  const setFocus = () => {
    manualFocus = false
    ref.current.focus()
    manualFocus = true
  }

  const handleOnFocus = () => {
    manualFocus && onFocus()
  }

  return (
    <StyledSearchInput>
      <SearchIcon showIcon={showIcon} />
      <input
        ref={ref}
        spellCheck={false}
        value={searchString}
        onChange={setSearchString}
        onBlur={onBlur}
        onFocus={handleOnFocus}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      <ClearIcon
        showClear={showClear}
        setSearchString={setSearchString}
        searchString={searchString}
        onClear={onClear}
        setFocus={setFocus}
      />
    </StyledSearchInput>
  )
}

SearchInput.defaultProps = {
  showIcon: true,
  showClear: true
}

SearchInput.propTypes = {
  searchString: PropTypes.string.isRequired,
  setSearchString: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onClear: PropTypes.func,
  placeholder: PropTypes.string,
  showIcon: PropTypes.bool,
  showClear: PropTypes.bool
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

    ::placeholder {
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: ${(props) => props.theme.placeholderColor};
      opacity: 1; /* Firefox */
    }

    :-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: ${(props) => props.theme.placeholderColor};
    }

    ::-ms-input-placeholder {
      /* Microsoft Edge */
      color: ${(props) => props.theme.placeholderColor};
    }
  }
`
