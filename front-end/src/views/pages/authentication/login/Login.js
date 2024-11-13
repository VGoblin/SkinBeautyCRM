import React from "react"
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap"
import { Mail, Lock, Check } from "react-feather"
import { history } from "../../../../history"
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { connect } from "react-redux"
import { signinWithJWT } from "../../../../redux/actions/auth"

import loginImg from "../../../../assets/img/pages/login.png"
import "../../../../assets/scss/pages/authentication.scss"
import Select from "react-select"

const locations = [{ value: "BonitaLaser", label: "BonitaLaser" }, { value: "BonitaLaserNorth", label: "BonitaLaserNorth" }]

class Login extends React.Component {
  state = {
    activeTab: "1",
    email : "",
    password: "",
    location: "BonitaLaser"
  }
  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  handleLogin = e => {
    e.preventDefault()
    this.props.signinWithJWT(
      this.state.email,
      this.state.password,
      this.state.location
    )
  }

  render() {
    return (
      <Row className="m-0 justify-content-center">
        <Col
          sm="8"
          xl="7"
          lg="10"
          md="8"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center px-1 py-0"
              >
                <img src={loginImg} alt="loginImg" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 px-2">
                      <CardBody>
                        <h4>Login</h4>
                        <p>Welcome back, please login to your account.</p>
                        <Form onSubmit={this.handleLogin}>
                          <FormGroup className="form-label-group position-relative has-icon-left">
                            <Input
                              type="email"
                              placeholder="Email"
                              value={this.state.email}
                              onChange={e => this.setState({ email: e.target.value })}
                            />
                            <div className="form-control-position">
                              <Mail size={15} />
                            </div>
                            <Label>Email</Label>
                          </FormGroup>
                          <FormGroup className="form-label-group position-relative has-icon-left">
                            <Input
                              type="password"
                              placeholder="Password"
                              value={this.state.password}
                              onChange={e => this.setState({ password: e.target.value })}
                            />
                            <div className="form-control-position">
                              <Lock size={15} />
                            </div>
                            <Label>Password</Label>
                          </FormGroup>
                          <FormGroup className="form-label-group">
                            <Select
                                  className="React"
                                  classNamePrefix="select"
                                  defaultValue={locations[0]}
                                  name="location"
                                  options={locations}
                                  value={locations.find(obj => obj.value===this.state.location)}
                                  onChange={e => this.setState({ location: e.value })}
                                />
                            <Label>Location</Label>
                          </FormGroup>
                          <FormGroup className="d-flex justify-content-between align-items-center">
                            <Checkbox
                              color="primary"
                              icon={<Check className="vx-icon" size={16} />}
                              label="Remember me"
                            />
                            <div className="float-right">
                              Forgot Password?
                            </div>
                          </FormGroup>
                          <div className="d-flex justify-content-between">
                            <Button.Ripple color="primary" type="submit">
                                Login
                            </Button.Ripple>
                          </div>
                        </Form>
                      </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = state => {
  return {

  }
}
export default connect(mapStateToProps, { signinWithJWT })(Login)
