import React from "react";
import { fireEvent, cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SearchInput from "../SearchInput";

afterEach(cleanup);

const defaultProps = {
  placeholder: "Search",
  setSearchString: ()=>{},
  searchString: "",
  onFocus: ()=>{},
  onBlur: ()=>{}
}

describe("<SearchInput>", ()=> {

  test("Renders the input box", () => {
    const {queryByPlaceholderText} = render(<SearchInput {...defaultProps} />)
    const inputNode = queryByPlaceholderText(/search/i);
    expect(inputNode).toBeInTheDocument()
  });

  test("setSearchString is called on input change", () => {
    const setSearchString = jest.fn();
    const {queryByPlaceholderText} = render(
      <SearchInput {...defaultProps} setSearchString={setSearchString} />)
    const inputNode = queryByPlaceholderText(/search/i);
    fireEvent.change(inputNode, {target: { value: "Text" }});
    expect(setSearchString).toHaveBeenCalled();
  });

  test("onFocus is called when input is focused", () => {
    const onFocus = jest.fn();
    const {queryByPlaceholderText} = render(
      <SearchInput {...defaultProps} onFocus={onFocus} />)
    const inputNode = queryByPlaceholderText(/search/i);
    fireEvent.focus(inputNode)
    expect(onFocus).toHaveBeenCalled();
  });

  test("onBlur is called when input loses focus", () => {
    const onBlur = jest.fn();
    const {queryByPlaceholderText} = render(
      <SearchInput {...defaultProps} onBlur={onBlur} />)
    const inputNode = queryByPlaceholderText(/search/i);
    fireEvent.blur(inputNode)
    expect(onBlur).toHaveBeenCalled();
  });

  test("The icon is not visbile when showIcon is false", () => {
    const {container} = render(
      <SearchInput {...defaultProps} showIcon={false} />)
    expect(container.getElementsByTagName("svg").length).toBe(0);
  });

  test("The icon is visbile when showIcon is true", () => {
    const {container} = render(
      <SearchInput {...defaultProps} showIcon={true} />)
    expect(container.getElementsByTagName("svg").length).toBe(1);
  });

});