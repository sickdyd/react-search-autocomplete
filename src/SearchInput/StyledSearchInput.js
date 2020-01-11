import styled from "styled-components";

const StyledSearchInput = styled.div`

  min-height: ${props => props.theme.height};
  width: 100%;

  display: flex;
  align-items: center;

  > input {

    width: 100%;

    padding: 0 0 0 13px;

    border: none;
    outline: none;

    background-color: rgba(0, 0, 0, 0);

    color: ${props => props.theme.color};

  }

  > svg {
    
    flex-shrink: 0;
    margin-left: 16px;
    fill: ${props => props.theme.iconColor};
  }

`;

export { StyledSearchInput };