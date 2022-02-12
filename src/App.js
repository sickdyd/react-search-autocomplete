import React from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import "./App.css";
import logo from "./sickdoodle.png";

function App() {
  const items = [
    {
      id: 0,
      name: "Cobol",
    },
    {
      id: 1,
      name: "JavaScript",
    },
    {
      id: 2,
      name: "Basic",
    },
    {
      id: 3,
      name: "PHP",
    },
    {
      id: 4,
      name: "Java",
    },
  ];

  const manyItems = [...new Array(10000)].map((_, i) => ({
    id: i,
    name: `something${i}`,
    description:
      "Some description text, where the search will be performed too.",
  }));

  const movieItems = [
    {
      id: 0,
      title: "Titanic",
      description: "A movie about love",
    },
    {
      id: 1,
      title: "Dead Poets Society",
      description: "A movie about poetry and the meaning of life",
    },
    {
      id: 2,
      title: "Terminator 2",
      description: "A robot from the future is sent back in time",
    },
    {
      id: 3,
      title: "Alien 2",
      description: "Ripley is back for a new adventure",
    },
  ];

  const handleOnSearch = (string, results) => {
    console.log(string, results);
  };

  const handleOnHover = (result) => {
    console.log(result);
  };

  const handleOnSelect = (item) => {
    console.log(item);
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const handleOnClear = () => {
    console.log("Cleared");
  };

  const formatResult = (item) => {
    console.log(item);
    return (
      <div className="result-wrapper">
        <span className="result-span">id: {item.id}</span>
        <span className="result-span">name: {item.name}</span>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ width: 200, margin: 20 }}>
          <img
            src={logo}
            alt="logo"
            style={{ width: "100%", marginBottom: 20 }}
          />
          <div style={{ marginBottom: 20 }}>Try to type "JavaScript"</div>
          <ReactSearchAutocomplete
            items={items}
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            onClear={handleOnClear}
            styling={{ zIndex: 4 }} // To display it on top of the search box below
            autoFocus
          />
          <div style={{ marginTop: 20 }}>This text will be covered!</div>
        </div>
        <div style={{ width: 200, margin: 20 }}>
          <h2>10000 items!</h2>
          <div style={{ marginBottom: 20 }}>Try to type a number</div>
          <ReactSearchAutocomplete
            items={manyItems}
            maxResults={15}
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            onClear={handleOnClear}
            fuseOptions={{ keys: ["name", "description"] }} // Search in the description text as well
            styling={{ zIndex: 3 }} // To display it on top of the search box below
          />
          <div style={{ marginTop: 20 }}>This text will be covered!</div>
        </div>
        <div style={{ width: 200, margin: 20 }}>
          <h2>My custom searchbox!</h2>
          <div style={{ marginBottom: 20 }}>Try to type "Titanic"</div>
          <ReactSearchAutocomplete
            items={movieItems}
            fuseOptions={{ keys: ["title", "description"] }} // Search on both fields
            resultStringKeyName="title" // String to display in the results
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            onClear={handleOnClear}
            showIcon={false}
            styling={{
              height: "34px",
              border: "1px solid darkgreen",
              borderRadius: "4px",
              backgroundColor: "white",
              boxShadow: "none",
              hoverBackgroundColor: "lightgreen",
              color: "darkgreen",
              fontSize: "12px",
              fontFamily: "Courier",
              iconColor: "green",
              lineColor: "lightgreen",
              placeholderColor: "darkgreen",
              clearIconMargin: "3px 8px 0 0",
              zIndex: 2,
            }}
          />
          <div style={{ marginTop: 20 }}>This text will be covered!</div>
        </div>
        <div style={{ width: 300, margin: 20 }}>
          <h2>With formatted results!</h2>
          <div style={{ marginBottom: 20 }}>Try to type "JavaScript"</div>
          <ReactSearchAutocomplete
            items={items}
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            onClear={handleOnClear}
            styling={{ zIndex: 1 }}
            formatResult={formatResult}
            autoFocus
          />
          <div style={{ marginTop: 20 }}>This text will be covered!</div>
        </div>
      </header>
    </div>
  );
}

export default App;
