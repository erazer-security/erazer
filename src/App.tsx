import { ChakraProvider } from "@chakra-ui/react";
import Banner from "./components/Banner";
// import HomePage from "./components/HomePage";
import PrivateInvestigator from "./components/PrivateInvestigator";
import "./styles/global.css";
import "./App.css";

function App() {
  return (
    <ChakraProvider>
      <Banner />
      {/* <HomePage /> */}
      <PrivateInvestigator />
    </ChakraProvider>
  );
}

export default App;
