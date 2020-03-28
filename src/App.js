import React, {useReducer} from 'react';
import './App.css';

import {ContextProvider} from './context'
import reducer from './reducer'

import SplashScreen from './Components/SplashScreen'

export default function App() {
  const initialState = {}
  const [state, dispatch] = useReducer(reducer, initialState)
  
  return (
    <div className="App w-full h-full">
        <SplashScreen></SplashScreen>
    </div>
  );
}

