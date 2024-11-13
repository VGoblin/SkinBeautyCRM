import {Axios} from "../root"
import { toast } from 'react-toastify';

export const getData = params => {
  console.log("Get Data Media Parmas: ", params);

    return async dispatch => {
      await Axios.get("settings/get_media_data", params).then(response => {
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
          dispatch({ type: "GET_MEDIA_ALL_DATA", data: rdata.data })
          dispatch({
            type: "GET_MEDIA_DATA",
            data: fdata,
            totalPages: totalPages,
            newparams
          })
        }
      })
    }
  }
  
  export const getInitialData = () => {
    return async dispatch => {
      await Axios.get("/api/datalist/initial-data").then(response => {
        dispatch({ type: "GET_MEDIA_ALL_DATA", data: response.data })
      })
    }
  }
  
  export const filterData = value => {
    return dispatch => dispatch({ type: "FILTER_MEDIA_DATA", value })
  }
  
  export const deleteData = obj => {
    return dispatch => {
      Axios
        .post("settings/media_delete",obj)
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
    console.log("OBJ", obj);
    return (dispatch, getState) => {
      Axios
        .post("settings/media_update", obj)
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
    console.log("ADD", obj);
    return (dispatch, getState) => {
      Axios
        .post("settings/media_add", obj)
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
  