import {Axios} from "../root"
import { toast } from 'react-toastify';

export const getData = (params,customer_id) => {
  console.log("CUSTOMERID: ", customer_id)
    return async dispatch => {
      await Axios.post("customers/sessions", {customer_id:customer_id}).then(response => {
        if(!response.data.status){
          toast.error('Internal Server Error!');
        }
        else{
          let rdata = response.data;
          let { page, perPage } = params;
          let totalPages = Math.ceil(rdata.data.length / perPage);
          let fdata = [];
          let newparams = {};
          if (page !== undefined && perPage !== undefined) {
            let calculatedPage = (page - 1) * perPage;
            let calculatedPerPage = page * perPage;
              if(calculatedPage > rdata.data.length){
              totalPages = Math.ceil(rdata.data.length / perPage);
              fdata = rdata.data.slice(0, perPage);
              newparams['page'] = 0;
              newparams['perPage'] = perPage;
            }else{
              fdata = rdata.data.slice(calculatedPage, calculatedPerPage);
              newparams = params;
            }
          }else {
            totalPages = Math.ceil(rdata.data.length / perPage);
            fdata = rdata.data.slice(0, perPage);
            newparams = params;
          }
          if(fdata.length === 0){
            newparams['page'] = 0;
            newparams['perPage'] = perPage;
            fdata = rdata.data.slice(0, perPage);
          }
          dispatch({ type: "GET_SESSIONS_ALL_DATA", data: rdata.data })
          dispatch({
            type: "GET_SESSIONS_DATA",
            data: fdata,
            totalPages: totalPages,
            newparams
          })
        }
      })
    }
  }

  export const getCustomers = () => {
    return async dispatch => {
      await Axios.post("customers/init_session_data").then(response => {
        if(!response.data.status){
          toast.error('Internal Server Error!');
        }
        else{
          dispatch({ type: "GET_CUSTOMERS", data: response.data })
        }
      })
    }
  }


  export const filterData = value => {
    return dispatch => dispatch({ type: "FILTER_SESSIONS_DATA", value })
  }

  export const deleteData = obj => {
    return dispatch => {
      Axios
        .post("customers/session_delete",obj)
        .then(response => {
          if(!response.data.status){
            toast.error(response.data.msg);
          }
          else{
            dispatch(getData(obj))
          }
        })
    }
  }

  export const updateData = obj => {
    console.log(obj);
    return (dispatch, getState) => {
      Axios
        .post("customers/session_update", obj)
        .then(response => {
          if(!response.data.status){
            toast.error(response.data.msg);
          }
          else{
            dispatch(getData(obj))
          }
        })
    }
  }

  export const addData = obj => {
    return (dispatch, getState) => {
      Axios
        .post("customers/session_add", obj)
        .then(response => {
          if(!response.data.status){
            toast.error(response.data.msg);
          }
          else{
            dispatch(getData(obj))
          }
        })
    }
  }
