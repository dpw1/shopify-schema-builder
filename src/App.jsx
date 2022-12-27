import logo from "./logo.svg";
import "./App.scss";
import URL from "./components/URL";
import Creator from "./components/Creator";
import CodeTable from "./components/CodeTable";
import Sidebar from "./components/Sidebar";
import Section from "./components/Section";
import Header from "./components/Header";

import { initialState } from "./utils";
import Preview from "./components/Preview";
import "./assets/Polaris.scss";
import { AppProvider } from "@shopify/polaris";

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
            marginBottom: 60,
          }}>
          Copy & paste pre-made sections{" "}
          <a
            target="_blank"
            href="https://ezfycode.com/shop?source=section-builder">
            available here
          </a>
          .
        </h3>
        <div className="App-wrapper">
          {/* <>
            <Header></Header>
            <Sidebar>
              <Section />
            </Sidebar>
          </> */}

          <AppProvider>
            <Preview />
            {/* <Creator /> */}
            <CodeTable></CodeTable>
          </AppProvider>
        </div>
      </div>
    </div>
  );
}

export default App;
