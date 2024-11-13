import {Axios} from "../root"
import { toast } from 'react-toastify';
import { history } from "../../../history"

export const getForm = url => {
    return dispatch => {
      Axios
        .post("customers/get_consent_form", {
          url: url
        })
        .then(response => {
            dispatch({type:'CONSENT_FORM', data:response.data});
        })
    }
  }

  export const submitConsentForm = data => {
    return dispatch => {
      Axios
        .post("customers/submit_consent_form", data)
        .then(response => {
            if(response.data.status && response.data.emailSent){
              toast.success("Email sent successfully.");
            }
            else{
              toast.success("Email didn't send correctly.");
            }
            dispatch({type:'SUBMIT_CONSENT_FORM', data:response.data});
        }).catch(err => {
          throw err;
      })
    }
  }
