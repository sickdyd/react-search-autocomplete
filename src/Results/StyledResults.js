import styled from "styled-components";

const StyledResults = styled.div`

  > div.line {
    border-top-color: ${props => props.theme.lineColor};
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
    max-height: ${props => props.theme.maxHeight};
    
    > li {
      display: flex;
      align-items: center;
      padding: 4px 0 4px 0;

      &:hover {
        background-color: ${props => props.theme.hoverBackgroundColor};
        cursor: default;
      }

      > .icon {
        margin-left: 16px;  

        > svg {
          fill: ${props => props.theme.iconColor};
        }
      }
      
      > div {
        margin-left: 13px;
      }
    }
  }
  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export { StyledResults };