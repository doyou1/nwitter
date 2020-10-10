import React, {useEffect, useState} from 'react';
//상대경로로 import
//import AppRouter from './Router';
//import firebase from "../firebase";

import AppRouter from "components/Router";
import {authService} from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user){
        setIsLoggedIn(true); 
        setUserObj(user);
     }else{
        setIsLoggedIn(false);
      }
      setInit(true);  
    });
  });

  return(
    <>
      {init ? (
      <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/>
      ) : (
        "Initializing..."
      )}
    <footer>&copy; {new Date().getFullYear()} Nwitter </footer>
    </>
  );
  
}

export default App;
