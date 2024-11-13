import {Axios} from "../root"
import { toast } from 'react-toastify';

export const generateUrl = (sessionTime) => {
  return dispatch => {
    Axios.post("customers/generate_url", {
    session_time: sessionTime
  })
  .then(response => {
    console.log("GenerateUrl Response: ", response);
    if(response.data.status){
      dispatch({
        type: "GENERATE_URL",
        url: response.data.url
      })

    }
    else{
        toast.error(response.data.msg);
    }
  })
  .catch(err => console.log(err))
  }
}

export const isOpened = (url) => {
  return dispatch => {
    Axios.post("customers/isopened", {
    url: url
  })
  .then(response => {
    if(response.data.status){
      toast.success('This url is already opened.');
    }
    else{
        toast.error(response.data.msg);
    }
  })
  .catch(err => console.log(err))
  }
}

export const timeLeft = (url) => {
  return dispatch => {
    Axios.post("customers/timeleft", {
    url: url
  })
  .then(response => {
    if(response.data.status){

      toast.success(response.data.msg);
    }
    else{
        toast.error(response.data.msg);
    }
  })
  .catch(err => console.log(err))
  }
}

export const getData = params => {
    return async dispatch => {
      await Axios.get("customers/customers", params).then(response => {
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
            totalPages = Math.ceil(rdata.data.length / 4);
            fdata = rdata.data.slice(0, 4);
            newparams = params;
          }
          if(fdata.length === 0){
            newparams['page'] = 0;
            newparams['perPage'] = 4;
            fdata = rdata.data.slice(0, 4);
          }
          dispatch({ type: "GET_CUSTOMER_ALL_DATA", data: rdata.data, bodyarea: rdata.bodyarea })
          dispatch({
            type: "GET_CUSTOMER_DATA",
            data: fdata,
            bodyarea: rdata.bodyarea,
            totalPages: totalPages,
            newparams
          })
        }
      })
    }
  }
  
  export const filterData = value => {
    return dispatch => dispatch({ type: "FILTER_CUSTOMER_DATA", value })
  }
  
  export const deleteData = obj => {
    return dispatch => {
      Axios
        .post("customers/delete",obj)
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
        .post("customers/update", obj)
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
        .post("customers/add", obj)
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