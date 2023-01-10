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
import "./components/PopupConfirm.scss";
import { AppProvider, Text } from "@shopify/polaris";

function App() {
  return (
    <div className="App">
      <div className="container">
        <div className="">
          <AppProvider>
            <Header></Header>

            <div className="App-wrapper">
              <Preview />
              {/* <Creator /> */}

              <div style={{}}>
                <div className="App-intro">
                  {" "}
                  <Text variant="heading4xl" as="h1">
                    EZFY Shopify Section Builder
                  </Text>
                  <Text variant="heading2xl" as="h2">
                    Coded by{" "}
                    <a target="_blank" href="https://ezfycode.com">
                      ezfycode.com
                    </a>
                  </Text>{" "}
                  <Text variant="headingMd" as="h3">
                    Copy & paste pre-made sections{" "}
                    <a
                      target="_blank"
                      href="https://ezfycode.com/shop?source=section-builder">
                      available here
                    </a>
                    .
                  </Text>{" "}
                </div>
                <CodeTable></CodeTable>
              </div>
            </div>
          </AppProvider>
        </div>
      </div>
    </div>
  );
}

export default App;
