import React, { Component } from "react"
import { Label, Input, FormGroup, Button } from "reactstrap"
import { X } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import classnames from "classnames"

class MediaHistoryDataListSidebar extends Component {
  state = {
    _id:'',
    question: "",
    activate: "Visible"
  }

  addNew = false

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.question !== prevState.question) {
        this.setState({ question: this.props.data.question })
      }
      if (this.props.data.activate !== prevState.activate) {
        this.setState({ activate: this.props.data.activate })
      }
      if (this.props.data._id !== prevState._id) {
        this.setState({ _id: this.props.data._id})
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        _id: "",
        question: "",
        activate: "Visible"
      })
    }
    if (this.addNew) {
      this.setState({
        _id: "",
        question: "",
        activate: "Visible"
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
    let { question, activate } = this.state
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
            <Label for="data-name">Question</Label>
            <Input
              type="text"
              value={question}
              placeholder="John Doe"
              onChange={e => this.setState({ question: e.target.value })}
              id="data-question"
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-activate">Activate</Label>
            <Input
              type="select"
              id="data-activate"
              value={activate}
              onChange={e => this.setState({ activate: e.target.value })} >
              <option>Visible</option>
              <option>Invisible</option>
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
export default MediaHistoryDataListSidebar
