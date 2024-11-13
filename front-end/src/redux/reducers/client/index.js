const initialState = {
    status: false,
    basicquestions: [],
    mediahistory:[],
    msg:'',
    emailSent: null
  }
  const client = (state = initialState, action) => {
    switch (action.type) {
      case "CONSENT_FORM": {
          console.log("DATA:", action.data);
        return { ...state,  status: action.data.status,bodyarea: action.data.bodyarea, basicquestions: action.data.basicquestions, mediahistory: action.data.mediahistory}
      }
      case "SUBMIT_CONSENT_FORM": {
        console.log("ConsentData:", action.data);
        return { ...state,  status: action.data.status,emailSent: action.data.emailSent}
      }
      default: {
        return state
      }
    }
  }

  export default client
