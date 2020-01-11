import React from "react";
import { fireEvent, cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Results from "../Results";

const items = [
  {
    id: 0,
    name: "value0"
  },
  {
    id: 1,
    name: "value1"
  },
  {
    id: 2,
    name: "value2"
  },
  {
    id: 3,
    name: "value3"
  },
]

const defaultProps = {
  results: items,
  onClick: ()=>{},
  showIcon: true,
  maxResults: 10,
  searchString: "",
}

afterEach(cleanup);

describe("<Results>", ()=> {

  test("Renders results", () => {
    const {container} = render(<Results {...defaultProps} />);
    expect(container.getElementsByClassName("line").length).toBe(1);
    expect(container.getElementsByTagName("li").length).toBe(4);
    expect(container.getElementsByClassName("icon").length).toBe(4);
    expect(container.getElementsByClassName("ellipsis").length).toBe(4);
    expect(container.getElementsByTagName("svg").length).toBe(4);
  });

  test("Shows no results", () => {
    const {container} = render(<Results {...defaultProps} results={[]} />);
    expect(container.querySelector(".line")).toBe(null);
  });

  test("onClick is called when <li> element clicked", () => {
    const onClick = jest.fn();
    const {container} = render(<Results {...defaultProps} onClick={onClick} />);
    const liTag = container.getElementsByTagName("li")[0];
    fireEvent.mouseDown(liTag);
    expect(onClick).toHaveBeenCalled();
  });

  test("The icon is not visible when showIcon is false", () => {
    const {container} = render(<Results {...defaultProps} showIcon={false} />);
    expect(container.querySelector(".icon")).toBe(null);
  });

  test("Renders only 2 result", () => {
    const {container} = render(<Results {...defaultProps} maxResults={2} />);
    expect(container.getElementsByClassName("line").length).toBe(1);
    expect(container.getElementsByClassName("icon").length).toBe(2);
    expect(container.getElementsByClassName("ellipsis").length).toBe(2);
    expect(container.getElementsByTagName("svg").length).toBe(2);
  });

});