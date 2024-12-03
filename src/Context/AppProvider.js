import React, { useEffect, useState, useCallback, useContext } from "react";
import AppContext from "./AppContext";
import { getUserDetails } from "../services/auth-service";

const initialState = {
  "USERNAME":"",
  "FIRSTNAME": "",
  "LASTNAME": "",
};

const AppProvider = (props) => {
  const [auth, setAuth] = useState(null);
  const [fields, setFields] = useState(initialState);


  const handleAccessToken = useCallback(async () => {
    const token = window.sessionStorage.getItem('token');
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await getUserDetails(headers);
       console.log("fetch getuser details----------", response)
      if (response) {
        setFields(prev => ({
          ...prev,
          ...response
        }));
        setAuth(true);
      } 
      else {
        setAuth(false);
        window.sessionStorage.removeItem('token');
      }
    } else {
      setAuth(false);
    }
  }, []);

  useEffect(() => {
    handleAccessToken();
  }, [handleAccessToken]);
  return (
    <AppContext.Provider value={{ auth, setAuth, fields, handleAccessToken }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
