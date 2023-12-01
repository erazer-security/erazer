import { ChakraProvider } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Header from "@components/Header";
import Home from "@pages/Home";
import Signin from "@pages/Signin";
import PrivateRoute from "@components/PrivateRoute";
import Dashboard from "@pages/Dashboard";
import Feedback from "@pages/Feedback";
import PrivacyPolicy from "@pages/PrivacyPolicy";
import "./styles/global.css";
import "./App.css";

function App() {
  return (
    <ChakraProvider>
      <div className="backgroundContainer">
        <div className="noiseBg"></div>
        <div className="mainShape"></div>
      </div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
