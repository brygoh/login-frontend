import React, {useState, useEffect} from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import './App.css';
import Admin from './Admin';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function Login() {

  const [loginButton, setLoginButton] = useState(true);
  const [logoutButton, setLogoutButton] = useState(false);

  const [items, setItems] = useState([]);
  const [click, setClick] = useState(false);
  const [check, setCheck] = useState(false);
  const [admin, setAdmin] = useState(false);

  const [who, setWho] = useState('');

  useEffect(() => {
    fetch(process.env.REACT_APP_API)
      .then(res => res.json()) 
        .then((result) => {
          setItems(result.original);
        }, (error) => {
          console.log(error);
        })
  }, [])

  const onSuccess = (res) => {
    setClick(true);
    for (var i in items.map(item => item.email)) {
      if (String(items[i].email) === String(res.profileObj.email)) {
        if (String(items[i].role) === 'Admin') {
          setAdmin(true);
          setWho(res.profileObj.email);
        }
        axios.post(process.env.REACT_APP_API + '/login',
          { email: items[i].email,
            name: items[i].name,
            role: items[i].role },
            {headers: {"Authorization" : `Bearer ${res.tokenId}`}})
          .then(response => {
            localStorage.setItem('authToken', (response.data.token));
            setCheck(response.data.verify);
          })
          .catch(err => console.log(err))
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
    setClick(false);
  }

  return (
    <div className="app-container">
      {loginButton && !click && !check ?
        <div className="login-container">
          <div className="col-container">
            <h1 className="title-container">Login With Google</h1>
            <GoogleLogin
              render={renderProps => (
                <Button onClick={renderProps.onClick} variant="dark">Login</Button>
              )}
              clientId={process.env.REACT_APP_GOOGLE_CLIENT}
              buttonText="Login"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={'single_host_origin'}/>
          </div>
          <img height="500px" width="500px" src="emailCapture.svg" alt="Login Page"></img>
        </div>: null}

      {(click && !check) ?
      <div className="login-container">
        <div className="col-container">
          <h1 className="title-container">Login Failure</h1>
          <GoogleLogout
            render={renderProps => (
              <Button onClick={renderProps.onClick} variant="dark">Back</Button>
            )}
            clientId={process.env.REACT_APP_GOOGLE_CLIENT}
            buttonText="Logout"
            onLogoutSuccess={onLogoutSuccess}/>
        </div>
        <img height="500px" width="500px" src="serverDown.svg" alt="Failure Landing Page"></img>
      </div>:null}

      {logoutButton && click && check ?
      <div style={{width:'100%'}}>
        {admin ? <div className="admin-container">
          <h1 className="title-container">Admin Login Successful</h1>
          <Admin/>
          <div className="logout-container">
            <div className="name-container">Welcome {who} ... </div>
            <GoogleLogout
              render={renderProps => (
                <Button onClick={renderProps.onClick} variant="dark">Logout</Button>
              )}
              clientId={process.env.REACT_APP_GOOGLE_CLIENT}
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
              clientId={process.env.REACT_APP_GOOGLE_CLIENT}
              buttonText="Logout"
              onLogoutSuccess={onLogoutSuccess}/>
          </div>
          <img height="500px" width="500px" src="welcome.svg" alt="Logout Page"></img>
        </div>}
      </div>: null}
    </div>
  );
}

export default Login;
