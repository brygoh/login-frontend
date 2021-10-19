import React, {useState, useEffect} from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import './App.css';
import Admin from './Admin';

function Login() {

  const clientId = "759073796632-us9c4tshsk2ls6fhtus10q1njv3bdv2t.apps.googleusercontent.com";
  const [loginButton, setLoginButton] = useState(true);
  const [logoutButton, setLogoutButton] = useState(false);

  const [items, setItems] = useState([]);
  const [check, setCheck] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json()) 
        .then((result) => {
          console.log(result);
          setItems(result);
        }, (error) => {
          console.log(error);
        })
  }, [])

  const onSuccess = (res) => {
    for (var i in items.map(item => item.email)) {
      if (String(items[i].email) === String(res.profileObj.email)) {
        if (String(items[i].role) === 'Admin') {
          setAdmin(true);
        }
        setCheck(true);
        setLoginButton(false);
        setLogoutButton(true);
        break;
      }
    }
  }

  const onFailure = (res) => {
    console.log("Login Failure: ", res);
  }

  const onLogoutSuccess = () => {
    console.log("Logout Success: ");
    setLoginButton(true);
    setLogoutButton(false);
    setCheck(false);
    setAdmin(false);
  }

  return (
    <div className="app-container">
      {onSuccess}
      {loginButton || !check ?
      <div className="login-container">
        <h1 className="title-container">Login With Google</h1>
        <div className="row-container">
          <img height="500px" width="500px" src="emailCapture.svg"></img>
          <GoogleLogin
            clientId={clientId}
            buttonText="Login"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}/>
        </div>
      </div>: null}

      {(logoutButton && check) ?
      <div>
        {admin ? <div className="login-container">
          <h1 className="title-container">Admin Login Successful</h1>
          <Admin/>
          <div className="logout-container">
            <GoogleLogout
              clientId={clientId}
              buttonText="Logout"
              onLogoutSuccess={onLogoutSuccess}/>
          </div>
        </div> 

        :<div className="login-container">
          <h1 className="title-container">Login Successful</h1>
          <div className="row-container">
            <img height="500px" width="500px" src="emailCapture.svg"></img>
            <GoogleLogout
              clientId={clientId}
              buttonText="Logout"
              onLogoutSuccess={onLogoutSuccess}/>
          </div>
        </div>}
      </div>: null}
    </div>
  );
}

export default Login;
