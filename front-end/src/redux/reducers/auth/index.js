const initialState = {
  userinfo: null,
  isLoggedIn : false,
  userRole:'admin'
}
const auth = (state = initialState, action) => {
  switch (action.type) {

    case "LOGIN_WITH_JWT": {
      return { ...state, userinfo: action.payload,isLoggedIn: action.isLoggedIn }
    }
    default: {
      return state
    }
  }
}

export default auth