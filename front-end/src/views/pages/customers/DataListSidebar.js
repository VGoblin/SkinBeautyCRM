import React, { Component } from "react"
import { Label, Input, FormGroup, Button } from "reactstrap"
import { X } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import classnames from "classnames"

class DataListSidebar extends Component {
  state = {
    _id: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    price: "",
    fsession: "",
    lsession: "",
    referredby: ""
  }

  addNew = false

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data._id !== prevState._id) {
        this.setState({ _id: this.props.data._id })
      }
      if (this.props.data.name !== prevState.name) {
        this.setState({ name: this.props.data.name })
      }
      if (this.props.data.email !== prevState.email) {
        this.setState({ email: this.props.data.email })
      }
      if (this.props.data.phone !== prevState.phone) {
        this.setState({ phone: this.props.data.phone })
      }
      if (this.props.data.city !== prevState.city) {
        this.setState({ city: this.props.data.city })
      }
      if (this.props.data.fsession !== prevState.fsession) {
        this.setState({ fsession: this.props.data.fsession })
      }
      if (this.props.data.lsession !== prevState.lsession) {
        this.setState({ lsession: this.props.data.lsession })
      }
      if (this.props.data.referredby !== prevState.referredby) {
        this.setState({ referredby: this.props.data.referredby })
      }
      
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        _id: "",
        name: "",
        email: "",
        phone: "",
        city: "",
        price: "",
        fsession: "",
        lsession: "",
        referredby: ""
      })
    }
    if (this.addNew) {
      this.setState({
        _id: "",
        name: "",
        email: "",
        phone: "",
        city: "",
        price: "",
        fsession: "",
        lsession: "",
        referredby: ""
      })
    }
    this.addNew = false
  }

  handleSubmit = obj => {
    if (this.props.data !== null) {
      this.props.updateData(obj)
    } else {
      this.addNew = true
      this.props.addData(obj)
    }
    let params = Object.keys(this.props.dataParams).length
      ? this.props.dataParams
      : { page: 1, perPage: 10 }
    this.props.handleSidebar(false, true)
    this.props.getData(params)
  }

  render() {
    let { show, handleSidebar, data } = this.props
    let { name, email, phone, city, fsession, lsession, referredby } = this.state
    return (
      <div
        className={classnames("data-list-sidebar", {
          show: show
        })}>
        <div className="data-list-sidebar-header mt-2 px-2 d-flex justify-content-between">
          <h4>{data !== null ? "UPDATE DATA" : "ADD NEW DATA"}</h4>
          <X size={20} onClick={() => handleSidebar(false, true)} />
        </div>
        <PerfectScrollbar
          className="data-list-fields px-2 mt-3"
          options={{ wheelPropagation: false }}>
          <FormGroup>
            <Label for="data-name">Name</Label>
            <Input
              type="text"
              value={name}
              placeholder="Apple IphoneX"
              onChange={e => this.setState({ name: e.target.value })}
              id="data-name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-email">Email</Label>
            <Input
              type="text"
              id="data-email"
              value={email}
              onChange={e => this.setState({ email: e.target.value })} />
          </FormGroup>
          <FormGroup>
            <Label for="data-phone">Phone</Label>
            <Input
              type="text"
              id="data-phone"
              value={phone}
              onChange={e => this.setState({ phone: e.target.value })} />
          </FormGroup>
          <FormGroup>
            <Label for="data-city">City</Label>
            <Input
              type="text"
              id="data-city"
              value={city}
              onChange={e => this.setState({ city: e.target.value })} />
          </FormGroup>
          <FormGroup>
            <Label for="data-fsession">First Session</Label>
            <Input
              type="text"
              id="data-fsession"
              value={fsession}
              onChange={e => this.setState({ fsession: e.target.value })} />
          </FormGroup>
          <FormGroup>
            <Label for="data-lsession">Last Session</Label>
            <Input
              type="text"
              id="data-lsession"
              value={lsession}
              onChange={e => this.setState({ lsession: e.target.value })} />
          </FormGroup>
          <FormGroup>
            <Label for="data-referredby">Referred By</Label>
            <Input
              type="text"
              id="data-referredby"
              value={referredby}
              onChange={e => this.setState({ referredby: e.target.value })} />
          </FormGroup>
        </PerfectScrollbar>
        <div className="data-list-sidebar-footer px-2 d-flex justify-content-start align-items-center mt-1">
          <Button color="primary" onClick={() => this.handleSubmit(this.state)}>
            {data !== null ? "Update" : "Submit"}
          </Button>
          <Button
            className="ml-1"
            color="danger"
            outline
            onClick={() => handleSidebar(false, true)}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }
}
export default DataListSidebar
