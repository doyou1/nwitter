import React, {useEffect, useState} from 'react';
//상대경로로 import
//import AppRouter from './Router';
//import firebase from "../firebase";
import AppRouter from "components/Router";
import {authService} from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user){
        setUserObj({
          displayName : user.displayName,
          uid:user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
     }else{
       setUserObj(null);
     }
      setInit(true);  
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName : user.displayName,
      uid:user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
    /*
    setUserObj(Object.assign({},user));
    */
  }
  return(
    <>
      {init ? (
      <AppRouter
        refreshUser={refreshUser} 
        isLoggedIn={Boolean(userObj)} 
        userObj={userObj}/>
      ) : (
        "Initializing..."
      )}
    <footer>&copy; {new Date().getFullYear()} Nwitter </footer>
    </>
  );
  
}

export default App;
