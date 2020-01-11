import React from "react";
import PropTypes from "prop-types";
import { SearchIcon } from "../icons/SearchIcon";
import { StyledResults } from "./StyledResults";

export default function Results(props) {

  const {
    results,
    onClick,
    showIcon,
    maxResults,
  } = props;

  return (
    results.length > 0 ?
      <StyledResults>
        <div className="line" />
        <ul>
          {
            results.slice(0, maxResults).map( result => 
              <li key={result.id} onMouseDown={()=>onClick(result)}>
                {showIcon && <div className="icon"><SearchIcon /></div>}
                <div className="ellipsis" title={result.name}>
                  {result.name}
                </div>
              </li>)
          }
        </ul>
      </StyledResults>
    :
      null
  )
}

Results.defaultProps = {
  results: [],
}

Results.propTypes = {
  results: PropTypes.array,
  onClick: PropTypes.func,
  showIcon: PropTypes.bool,
  maxResults: PropTypes.number,
}