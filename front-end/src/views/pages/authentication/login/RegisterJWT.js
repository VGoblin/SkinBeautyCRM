import React from "react"
import { Form, FormGroup, Input, Label, Button } from "reactstrap"
import { connect } from "react-redux"
import { signupWithJWT } from "../../../../redux/actions/auth"
import { history } from "../../../../history"
import Select from "react-select"

const locations = [{ value: "BonitaLaser", label: "BonitaLaser" }, { value: "BonitaLaserNorth", label: "BonitaLaserNorth" }]

class RegisterJWT extends React.Component {
  state = {
    email: "",
    password: "",
    name: "",
    confirmPass: "",
    location:"BonitaLaser"
  }
  
  
  handleRegister = e => {
    e.preventDefault()
    this.props.signupWithJWT(
      this.state.email,
      this.state.password,
      this.state.name,
      this.state.location
      )
    }
    
    render() {
    return (
      <Form action="/" onSubmit={this.handleRegister}>
        <FormGroup className="form-label-group">
          <Input
            type="text"
            placeholder="Name"
            required
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
          />
          <Label>Name</Label>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="email"
            placeholder="Email"
            required
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
          />
          <Label>Email</Label>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="password"
            placeholder="Password"
            required
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
          />
          <Label>Password</Label>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Input
            type="password"
            placeholder="Confirm Password"
            required
            value={this.state.confirmPass}
            onChange={e => this.setState({ confirmPass: e.target.value })}
          />
          <Label>Confirm Password</Label>
        </FormGroup>
        <FormGroup className="form-label-group">
          <Select
                className="React"
                classNamePrefix="select"
                name="location"
                options={locations}
                value={locations.find(obj => obj.value == this.state.location)}
                onChange={e => this.setState({ location: e.value })}
              />
          <Label>Location</Label>
        </FormGroup>
        {/* <FormGroup>
          <Checkbox
            color="primary"
            icon={<Check className="vx-icon" size={16} />}
            label=" I accept the terms & conditions."
            defaultChecked={true}
          />
        </FormGroup> */}
        <div className="d-flex justify-content-between">
          <Button.Ripple
            color="primary"
            outline
            onClick={() => {
              history.push("/pages/login")
            }}
          >
            Login
          </Button.Ripple>
          <Button.Ripple color="primary" type="submit">
            Register
          </Button.Ripple>
        </div>
      </Form>
    )
  }
}
const mapStateToProps = state => {
  return {
  }
}
export default connect(mapStateToProps, { signupWithJWT })(RegisterJWT)
