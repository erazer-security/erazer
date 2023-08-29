import { ChakraProvider } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "@pages/Home";
import Product from "@pages/Product";
import Resources from "@pages/Resources";
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
        <Route path="/resources" element={<Resources />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
