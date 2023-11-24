import { ChakraProvider } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "@pages/Home";
import Signin from "@pages/Signin";
import PrivateRoute from "@components/PrivateRoute";
import Dashboard from "@pages/Dashboard";
import Results from "@components/Results";
import PrivateInvestigator from "@components/PrivateInvestigator";
import WallOfHorror from "@pages/WallOfHorror";
import Feedback from "@pages/Feedback";
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
        <Route path="/results" element={<Results />} />
        <Route path="/privateInvestigator" element={<PrivateInvestigator />} />
        <Route path="/wallofhorror" element={<WallOfHorror />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
