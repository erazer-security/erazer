import { ChakraProvider } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "@pages/Home";
import Product from "@pages/Product";
import WallOfHorror from "@pages/WallOfHorror";
import Feedback from "@pages/Feedback";
import "./styles/global.css";
import "./App.css";

function App() {
  return (
    <ChakraProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/wallofhorror" element={<WallOfHorror />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
