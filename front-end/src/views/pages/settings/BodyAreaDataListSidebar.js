import React, { Component } from "react"
import { Label, Input, FormGroup, Button } from "reactstrap"
import { X } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import classnames from "classnames"

class BodyAreaDataListSidebar extends Component {
  state = {
    _id:'',
    name: "",
    time: ""
  }

  addNew = false

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.name !== prevState.name) {
        this.setState({ name: this.props.data.name })
      }
      if (this.props.data.time !== prevState.time) {
        this.setState({ time: this.props.data.time })
      }
      if (this.props.data._id !== prevState._id) {
        this.setState({ _id: this.props.data._id})
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        _id: "",
        name: "",
        time: ""
      })
    }
    if (this.addNew) {
      this.setState({
        _id: "",
        name: "",
        time: ""
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
    // let params = Object.keys(this.props.dataParams).length
    //   ? this.props.dataParams
    //   : { page: 1, perPage: 10 }
    this.props.handleSidebar(false, true)
    // this.props.getData(params)
  }

  render() {
    let { show, handleSidebar, data } = this.props
    let { name, time } = this.state
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
              placeholder="John Doe"
              onChange={e => this.setState({ name: e.target.value })}
              id="data-name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-time">time</Label>
            <Input
              type="number"
              id="data-time"
              value={time}
              placeholder="10"
              onChange={e => this.setState({ time: e.target.value })}>
            </Input>
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
export default BodyAreaDataListSidebar
