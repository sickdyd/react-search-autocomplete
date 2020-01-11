import React from "react";
import PropTypes from "prop-types";
import { StyledSearchInput } from "./StyledSearchInput";
import { SearchIcon } from "./../icons/SearchIcon";

export default function SearchInput(props) {

  const {
    searchString,
    setSearchString,
    autoFocus,
    onBlur,
    onFocus,
    placeholder,
    showIcon,
  } = props;

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
  showIcon: true,
}

SearchInput.propTypes = {
  searchString: PropTypes.string.isRequired,
  setSearchString: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  showIcon: PropTypes.bool,
}