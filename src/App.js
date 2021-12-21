import React, {useState, useEffect} from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import './App.css';
import Admin from './Admin';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

function Login() {

  const [loginButton, setLoginButton] = useState(true);
  const [logoutButton, setLogoutButton] = useState(false);

  const [click, setClick] = useState(false);
  const [check, setCheck] = useState(false);
  const [admin, setAdmin] = useState(false);

  const [who, setWho] = useState('');

  useEffect(() => {
    if (click && check && admin) {
      return <Redirect to='/admin'/>
    }
  })

  const onSuccess = (res) => {
    setClick(true);
    axios.post(process.env.REACT_APP_API + 'login', 
      { email: res.profileObj.email },
      {headers: {"Authorization" : `Bearer ${res.tokenId}`}})
      .then (response => {
        localStorage.setItem('authToken', (response.data.token));
        setCheck(response.data.verify);
        setWho(res.profileObj.email)
        if (response.data.admin === 'Admin') 
          setAdmin(true)
        else
          setAdmin(false)
      })
      .catch(err => {
        console.log(err)
      })
      setLoginButton(false);
      setLogoutButton(true);
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

  function SuccessPage() {
    return(
      <>
        <div className="login-container">
          <div className="col-container">
            <div className="name-container">Welcome {who} ... </div>
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
        </div>
      </>
    );
  }

  function FailurePage() {
    return(
      <>
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
        </div>
      </>
    );
  }

  function AdminPage() {
    return(
      <div className="admin-container">
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
    )
  }

  function HomePage() {
    return(
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
      </div>
    );
  }

  return (
    <Router>
      {/* <div className="app-container">
      {loginButton && !click && !check ? <HomePage/> : null}

      {(click && !check) ? <FailurePage/> : null}

      {logoutButton && click && check ?
        <div style={{width:'100%'}}>
          {admin ? <AdminPage/> : <SuccessPage/>}
        </div> : null}
      </div> */}

      <Switch>
        <Route path='/success'>
          <SuccessPage/>
        </Route>
        <Route path='/failure'>
          <FailurePage/>
        </Route>
        <Route path='/admin'>
          <AdminPage/>
        </Route>
        <Route path='/'>
          <HomePage/>
        </Route>
      </Switch>
    </Router>
  );
}

export default Login;
