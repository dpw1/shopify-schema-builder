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
          EZFY Shopify Section Creator
        </h1>
        <h2 style={{ textAlign: "center", marginTop: -30, marginBottom: 40 }}>
          Coded by{" "}
          <a target="_blank" href="https://ezfycode.com">
            ezfycode.com.
          </a>
        </h2>
        <h3
          style={{
            textAlign: "center",
            fontWeight: "normal",
            marginTop: -30,
            marginBottom: 40,
          }}>
          Copy & paste pre-made sections{" "}
          <a target="_blank" href="https://ezfycode.com/shop">
            available here
          </a>
          .
        </h3>
        <div className="App-wrapper">
          <Creator />
          <CodeTable></CodeTable>
        </div>
      </div>
    </div>
  );
}

export default App;
