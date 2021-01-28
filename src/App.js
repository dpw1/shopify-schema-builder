import logo from "./logo.svg";
import "./App.scss";
import URL from "./components/URL";
import Creator from "./components/Creator";
import CodeTable from "./components/CodeTable";

function App() {
  return (
    <div className="App">
      <div className="container">
        <h1 style={{ textAlign: "center", marginBottom: 40 }}>
          Shopify Section Creator
        </h1>
        <div className="App-wrapper">
          <Creator />
          <CodeTable></CodeTable>
        </div>
      </div>
    </div>
  );
}

export default App;
