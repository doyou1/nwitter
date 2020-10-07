import React, {useState} from 'react';
//상대경로로 import
//import AppRouter from './Router';
//import firebase from "../firebase";

import AppRouter from "components/Router";
import {authService} from "fbase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  return(
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
    <footer>&copy; {new Date().getFullYear()} Nwitter </footer>
    </>
  );
  
}

export default App;
