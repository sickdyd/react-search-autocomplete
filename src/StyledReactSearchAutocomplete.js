import styled from "styled-components";

const StyledReactSearchAutocomplete = styled.div`

  position: relative;

  height: ${props => parseInt(props.theme.height) + 2 + "px"};

  > .wrapper {

    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100%;

    border: ${props => props.theme.border};
    border-radius: ${props => props.theme.borderRadius};

    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.color};

    font-size: ${props => props.theme.fontSize};

    &:hover {
      box-shadow: ${props => props.theme.boxShadow};
    }
    &:active {
      box-shadow: ${props => props.theme.boxShadow};
    }
    &:focus-within {
      box-shadow: ${props => props.theme.boxShadow};
    }
  }
`;

export { StyledReactSearchAutocomplete };