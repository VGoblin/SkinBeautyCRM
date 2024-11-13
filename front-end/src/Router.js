import React, { Suspense, lazy } from "react"
import { Router, Switch, Route, Redirect } from "react-router-dom"
import { history } from "./history"
import { connect } from "react-redux"
import Spinner from "./components/@vuexy/spinner/Loading-spinner"
import { SessionCheck, is_session } from "./redux/actions/auth"
import { ContextLayout } from "./utility/context/Layout"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Route-based code splitting
const Home = lazy(() =>
  import("./views/pages/Home")
)

const Customers = lazy(() =>
  import("./views/pages/customers/Customers")
)

const register = lazy(() =>
  import("./views/pages/authentication/login/Register")
)

const login = lazy(() =>
  import("./views/pages/authentication/login/Login")
)

const consentForm = lazy(() =>
  import("./views/customers/Consentform")
)

const Settings = lazy(() =>
  import("./views/pages/settings/Settings")
)

const Sessions = lazy(() =>
  import("./views/pages/sessions")
)

const PastSessions = lazy(() =>
  import("./views/pages/past_sessions")
)

const ErrorPage = lazy(() =>
  import("./views/pages/Error")
)

// Set Layout and Component Using App Route
const RouteConfig = ({
  component: Component,
  fullLayout,
  permission,
  user,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      return (
        <ContextLayout.Consumer>
          {context => {
            let LayoutTag =
              fullLayout === true
                ? context.fullLayout
                : context.state.activeLayout === "horizontal"
                ? context.horizontalLayout
                : context.VerticalLayout
              return (
                <LayoutTag {...props} permission={props.user}>
                  <Suspense fallback={<Spinner />}>
                    <Component {...props} />
                  </Suspense>
                </LayoutTag>
              )
          }}
        </ContextLayout.Consumer>
      )
    }}
  />
)
const mapStateToProps = state => {
  return {
    user: state.auth.userRole
  }
}

const AppRoute = connect(mapStateToProps)(RouteConfig)

const RequireAuth = (data) => {
  if (!is_session()) {
    return <Redirect to={'/login'} />;
  }
  return data.children;
};

class AppRouter extends React.Component {
  componentDidMount() {
    this.props.SessionCheck();
  }
  render() {
    return (
      <Router history={history}>
        <Switch>
          <AppRoute
            path="/login"
            component={login}
            fullLayout
          />
          <AppRoute
            path="/register"
            component={register}
            fullLayout
          />
          <AppRoute
            path="/request/:param1"
            component={consentForm}
            fullLayout
          />
          <AppRoute
            path="/error"
            component={ErrorPage}
            fullLayout
          />
          <RequireAuth>
            <AppRoute
              exact
              path="/"
              component={Home}
            />
            <AppRoute
              path="/customers"
              component={Customers}
            />
            <AppRoute
              path="/settings"
              component={Settings}
            />
            <AppRoute
              path="/sessions"
              component={Sessions}
            />
            <AppRoute
              path="/past_sessions"
              component={PastSessions}
            />
          </RequireAuth>
        </Switch>
        <ToastContainer />
      </Router>
    )
  }
}

const getIsLoggedIn = (state) => ({
  isLoggedIn : state.auth.isLoggedIn
})

const mapDispatchToProps = {
  SessionCheck, is_session
}

export default connect(getIsLoggedIn, mapDispatchToProps)(AppRouter)
