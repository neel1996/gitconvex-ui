import React, { useReducer } from "react";
import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router";
import "./App.css";

import { ContextProvider } from "./context";
import reducer from "./reducer";

import SplashScreen from "./Components/SplashScreen";
import Dashboard from "./Components/DashBoard/Dashboard";

export default function App() {
  const initialState = {};
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App w-full h-full">
      <BrowserRouter>
        <SplashScreen></SplashScreen>
        <Route to="/dashboard" render={() => <Dashboard></Dashboard>}></Route>
      </BrowserRouter>
    </div>
  );
}
