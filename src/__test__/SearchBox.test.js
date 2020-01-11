import React from "react";
import "@babel/polyfill";
import { fireEvent, cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ReactSearchAutocomplete from "../ReactSearchAutocomplete";

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

beforeEach(() => {
  localStorage.clear();
});

afterEach(()=>{
  cleanup();
  jest.clearAllMocks();
});

const defaultProps = {
  items: items,
  placeholder: "Search",
  onSearch: ()=>{},
  
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/* items,
fuseOptions,
useCaching,
inputDebounce,
onSearch,
onSelect,
onFocus,
showIcon,
maxResults,
placeholder,
autoFocus,
styling, */

describe("<ReactSearchAutocomplete>", ()=> {

  test("Renders the search box", () => {
    const {queryByPlaceholderText, container} = render(<ReactSearchAutocomplete {...defaultProps} />);
    const inputElement = queryByPlaceholderText(/search/i);
    // check that the input node is present
    expect(inputElement).toBeInTheDocument();
    // check that the icon is present
    expect(container.getElementsByTagName("svg").length).toBe(1);
    // check that wrapper div is present
    expect(container.getElementsByClassName("wrapper").length).toBe(1);
  });

  test("Shows 4 matching items", ()=> {
    const {queryByPlaceholderText, container} = render(<ReactSearchAutocomplete {...defaultProps} />);
    const inputElement = queryByPlaceholderText(/search/i);
    fireEvent.change(inputElement, { target: { value: "v" }});
    const ul = container.getElementsByTagName("ul")[0];
    expect(ul.getElementsByTagName("li").length).toBe(4);
    expect(ul.getElementsByTagName("svg").length).toBe(4);
  });

  test("Shows 1 matching item", ()=> {
    const {queryByPlaceholderText, queryAllByTitle, container, debug} = render(<ReactSearchAutocomplete {...defaultProps} />);
    const inputElement = queryByPlaceholderText(/search/i);
    fireEvent.change(inputElement, { target: { value: "0" }});
    expect(queryAllByTitle("value0").length).toBe(1);
    const ul = container.getElementsByTagName("ul")[0];
    expect(ul.getElementsByTagName("li").length).toBe(1);
    expect(ul.getElementsByTagName("svg").length).toBe(1);
  });

  test("Shows 0 matching item", ()=> {
    const {queryByPlaceholderText, container} = render(<ReactSearchAutocomplete {...defaultProps} />);
    const inputElement = queryByPlaceholderText(/search/i);
    fireEvent.change(inputElement, { target: { value: "despair" }});
    expect(container.getElementsByTagName("ul").length).toBe(0);
  });

  test("Don't use sessionStorage if useCaching is false", () => {
    const {queryByPlaceholderText} = render(<ReactSearchAutocomplete {...defaultProps} useCaching={false} />);
    const inputElement = queryByPlaceholderText(/search/i);
    fireEvent.change(inputElement, { target: { value: "cachingDisabled" }});
    expect(sessionStorage.getItem).not.toHaveBeenCalled();
    expect(sessionStorage.setItem).not.toHaveBeenCalled();
  });

  test("Use sessionStorage if useCaching is true", () => {
    const {queryByPlaceholderText} = render(<ReactSearchAutocomplete {...defaultProps} />);
    const inputElement = queryByPlaceholderText(/search/i);
    fireEvent.change(inputElement, { target: { value: "cachingEnabled" }});
    expect(sessionStorage.getItem).toHaveBeenCalled();
    expect(sessionStorage.setItem).toHaveBeenCalled();
  });

  test("Retrieve cached values", async () => {
    const onSearch = jest.fn();
    const {queryByPlaceholderText} = render(<ReactSearchAutocomplete {...defaultProps} onSearch={onSearch} />);
    const inputElement = queryByPlaceholderText(/search/i);
    fireEvent.change(inputElement, { target: { value: "cachingEnabled" }});
    await delay(300);
    expect(onSearch).toHaveBeenCalledWith("cachingEnabled", false);
    fireEvent.change(inputElement, { target: { value: "test" }});
    await delay(300);
    expect(onSearch).toHaveBeenCalledWith("test", false);
    fireEvent.change(inputElement, { target: { value: "cachingEnabled" }});
    await delay(300);
    expect(onSearch).toHaveBeenCalledWith("cachingEnabled", []);
  });

  test("Check if onSearch is called on change", async () => {
    const onSearch = jest.fn();
    const {queryByPlaceholderText} = render(<ReactSearchAutocomplete {...defaultProps} onSearch={onSearch} />);
    const inputElement = queryByPlaceholderText(/search/i);
    fireEvent.change(inputElement, { target: { value: "v" }});
    await delay(300);
    expect(onSearch).toHaveBeenCalled();
  });

  test("Check if onSelect is called on item selection", () => {
    const onSelect = jest.fn();
    const {queryByPlaceholderText, queryAllByTitle} = render(<ReactSearchAutocomplete {...defaultProps} onSelect={onSelect} />);
    const inputElement = queryByPlaceholderText(/search/i);
    fireEvent.change(inputElement, { target: { value: "v" }});
    const liNode = queryAllByTitle("value0")[0];
    fireEvent.mouseDown(liNode);
    expect(onSelect).toHaveBeenCalled();
  });

  test("Check if onFocus is called on input focus", () => {
    const onFocus = jest.fn();
    const {queryByPlaceholderText} = render(<ReactSearchAutocomplete {...defaultProps} onFocus={onFocus} />);
    const inputElement = queryByPlaceholderText(/search/i);
    fireEvent.focus(inputElement);
    expect(onFocus).toHaveBeenCalled();
  });

  test("Check if input is focused if autoFocus is true",  () => {
    const {queryByPlaceholderText} = render(<ReactSearchAutocomplete {...defaultProps} autoFocus={true} />);
    const inputElement = queryByPlaceholderText(/search/i);
    expect(inputElement).toHaveFocus();
  });

  test("Check if default inputDebounce works", () => {
    jest.useFakeTimers();
    const onSearch = jest.fn();
    const {queryByPlaceholderText} = render(
      <ReactSearchAutocomplete
        {...defaultProps}
        onSearch={onSearch}
      />);
    const inputElement = queryByPlaceholderText(/search/i);
    for (let i = 0; i < 10; i++) {
      fireEvent.change(inputElement, { target: { value: Math.random() }});
    }
    jest.runAllTimers();
    expect(onSearch).toBeCalledTimes(1);
  });

  test("If inputDebounce is 0, don't debounce", () => {
    jest.useFakeTimers();
    const onSearch = jest.fn();
    const {queryByPlaceholderText} = render(
      <ReactSearchAutocomplete
        {...defaultProps}
        onSearch={onSearch}
        inputDebounce={0}
      />);
    const inputElement = queryByPlaceholderText(/search/i);
    for (let i = 0; i < 10; i++) {
      fireEvent.change(inputElement, { target: { value: Math.random() }});
    }
    jest.runAllTimers();
    expect(onSearch).toBeCalledTimes(10);
  });

});