
import { history } from "../../../history"
import config from "../../../configs/config"
import {Axios} from "../root"
import jwt_decode from 'jwt-decode'
import { toast } from 'react-toastify';

export const changeRole = role => {
  return dispatch => dispatch({ type: "CHANGE_ROLE", userRole: role })
}

export const SessionCheck = () => {
  return dispatch => {
    var token = localStorage[config.token];
    if(token){
      dispatch({
        type: "LOGIN_WITH_JWT",
        payload: jwt_decode(token),
        isLoggedIn: true
      })
    }
  }
}

export const Logout = () => {
    return dispatch => {
        localStorage.removeItem([config.token]);
        localStorage.removeItem([config.expire])
        history.push('/login')
    }
}

export const is_session = () => {
  if(localStorage[config.token] && localStorage[config.token] !== "undefined"){
    if(!localStorage[config.expire] && localStorage[config.expire] === "undefined")
      return false;
    if(Date.now() - parseInt(localStorage[config.expire]) > config.expireTime)
      return false;

    return true;
  }else{
    return false;
  }
}

export const signupWithJWT = (email, password, name, location) => {
  return dispatch => {
    Axios.post("users/register", {
        email: email,
        password: password,
        username: name,
        location: location
      })
      .then(response => {
        var loggedInUser
        if(response.data.status){

          loggedInUser = response.data.token
          console.log("User: ", jwt_decode(loggedInUser));
          localStorage.setItem(config.token, loggedInUser)
          localStorage.setItem(config.expire, Date.now());
          dispatch({
            type: "LOGIN_WITH_JWT",
            payload: jwt_decode(loggedInUser),
            isLoggedIn: true
          })

          history.push("/")
        }
        else{
            toast.error(response.data.msg);
        }
      })
      .catch(err => console.log(err))
  }
}

export const signinWithJWT = (email, password, location) => {
    return dispatch => {
      console.log(Axios.post);
      Axios.post("users/login", {
          email: email,
          password: password,
          location: location
        })
        .then(response => {
          var loggedInUser
          if(response.data.status){
            loggedInUser = response.data.token
            console.log("User: ", jwt_decode(loggedInUser));
            localStorage.setItem(config.token, loggedInUser)
            localStorage.setItem(config.expire, Date.now());
            dispatch({
              type: "LOGIN_WITH_JWT",
              payload: jwt_decode(loggedInUser),
              isLoggedIn: true
            })

            history.push("/")
          }
          else{
              toast.error(response.data.msg);
          }
        })
        .catch(err => console.log(err))
    }
  }
