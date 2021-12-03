import React, {useState, useEffect} from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import './App.css';
import Admin from './Admin';
import Button from 'react-bootstrap/Button';
const jwt = require('jsonwebtoken');

function Login() {

  const clientId = "27021193844-7erhssfabe66ih8g02t0i2qfji55t3rr.apps.googleusercontent.com";
  const [loginButton, setLoginButton] = useState(true);
  const [logoutButton, setLogoutButton] = useState(false);

  const [items, setItems] = useState([]);
  const [click, setClick] = useState(false);
  const [check, setCheck] = useState(false);
  const [admin, setAdmin] = useState(false);

  const page = 1;
  const filter = '';

  useEffect(async () => {
    await fetch("https://login-backend-015.herokuapp.com/users")
      .then(res => res.json()) 
        .then((result) => {
          console.log(result.original);
          setItems(result.original);
        }, (error) => {
          console.log(error);
        })
  }, [])

  const onSuccess = (res) => {
    for (var i in items.map(item => item.email)) {
      console.log(items[i])
      if (String(items[i].email) === String(res.profileObj.email)) {
        if (String(items[i].role) === 'Admin') {
          setAdmin(true);
          const token = jwt.sign(
            {data: items[i]},
            'A=KD&Jv78#"q.V)L%>5#8L[/tG98j5y%CBZ66q(q4Lc#~N+F'
          )
          localStorage.setItem('authToken', token);
        }
        setCheck(true);
        setLoginButton(false);
        setLogoutButton(true);
        break;
      }
    }
    setClick(true);
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
    setClick(false);
  }

  return (
    <div className="app-container">
      {onSuccess}
      {(loginButton || !check) && !click?
        <div className="login-container">
          <div className="col-container">
            <h1 className="title-container">Login With Google</h1>
            <GoogleLogin
              render={renderProps => (
                <Button onClick={renderProps.onClick} variant="dark">Login</Button>
              )}
              clientId={clientId}
              buttonText="Login"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={'single_host_origin'}/>
          </div>
          <img height="500px" width="500px" src="emailCapture.svg"></img>
        </div>: null}

      {click && !check ?
      <div className="login-container">
        <div className="col-container">
          <h1 className="title-container">Login Failure</h1>
          <GoogleLogout
            render={renderProps => (
              <Button onClick={renderProps.onClick} variant="dark">Back</Button>
            )}
            clientId={clientId}
            buttonText="Logout"
            onLogoutSuccess={onLogoutSuccess}/>
        </div>
        <img height="500px" width="500px" src="serverDown.svg"></img>
      </div>:null}

      {(logoutButton && check) ?
      <div style={{width:'100%'}}>
        {admin ? <div className="admin-container">
          <h1 className="title-container">Admin Login Successful</h1>
          <Admin/>
          <div className="logout-container">
            <GoogleLogout
              render={renderProps => (
                <Button onClick={renderProps.onClick} variant="dark">Logout</Button>
              )}
              clientId={clientId}
              buttonText="Logout"
              onLogoutSuccess={onLogoutSuccess}/>
          </div>
        </div> 

        :<div className="login-container">
          <div className="col-container">
            <h1 className="title-container">Login Successful</h1>
            <GoogleLogout
              render={renderProps => (
                <Button onClick={renderProps.onClick} variant="dark">Logout</Button>
              )}
              clientId={clientId}
              buttonText="Logout"
              onLogoutSuccess={onLogoutSuccess}/>
          </div>
          <img height="500px" width="500px" src="welcome.svg"></img>
        </div>}
      </div>: null}
    </div>
  );
}

export default Login;
