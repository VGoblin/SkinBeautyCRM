import React, { Component } from "react"
import { Label, Input, FormGroup, Button } from "reactstrap"
import { X } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import classnames from "classnames"
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/light.css"
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import Select from "react-select"
import Multiselect from 'multiselect-react-dropdown';

const skinTypes = [
  {value:"1", label:"1"},
  {value:"2", label:"2"},
  {value:"3", label:"3"},
  {value:"4", label:"4"},
  {value:"5", label:"5"},
  {value:"6", label:"6"},
]

const getToday=()=>{
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  let dt = date.getDate();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }

  return year + "-" + month + "-" + dt;
}

class DataListSidebar extends Component {
  state = {
    _id: "",
    date: getToday(),
    area: "",
    skintype: "",
    selectedSkinTypeValue: {value:"1", label:"1"},
    kj: 0,
    cost: 0,
    comments: "",
    customer_id: "",
    options: []
  }

  addNew = false
  componentDidUpdate(prevProps, prevState) {
    if(this.props.customer_id !== prevState.customer_id){
      this.setState({ customer_id: this.props.customer_id })
    }

    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data._id !== prevState._id) {
        this.setState({ _id: this.props.data._id })
      }
      if (this.props.data.date !== prevState.date) {
        this.setState({ date: this.props.data.date })
      }
      if (this.props.data.area !== prevState.area) {
        this.setState({ area: this.props.data.area })
      }
      if (this.props.data.areas !== prevState.areas) {
        this.setState({ selectedValue: this.props.data.areas })
      }
      if (this.props.data.skintype !== prevState.skintype) {
        this.setState({ selectedSkinTypeValue: {value:this.props.data.skintype, label:this.props.data.skintype} })
        this.setState({ skintype: this.props.data.skintype })
      }
      if (this.props.data.kj !== prevState.kj) {
        this.setState({ kj: this.props.data.kj })
      }
      if (this.props.data.cost !== prevState.cost) {
        this.setState({ cost: this.props.data.cost })
      }
      if (this.props.data.comments !== prevState.comments) {
        this.setState({ comments: this.props.data.comments })
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        _id: "",
        date: new Date(),
        area: "",
        skintype: "",
        kj: 0,
        cost: 0,
        comments: "",
        customer_id: ''
      })
    }
    if (this.addNew) {
      this.setState({
        _id: "",
        date: new Date(),
        area: "",
        skintype: "",
        kj: 0,
        cost: 0,
        comments: "",
        customer_id: ''
      })
    }
    this.addNew = false
  }

  onSelect = (selectedList, selectedItem) => {
    var arrOfVals = [];
    selectedList.forEach(element => {
      arrOfVals.push(element.value);
    });
    this.setState({area: arrOfVals})
  }

  onRemove = (selectedList, removedItem) => {
    var arrOfVals = [];
    selectedList.forEach(element => {
      arrOfVals.push(element.value);
    });
    this.setState({area: arrOfVals})
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
      : { page: 1, perPage: 4 }
    this.props.handleSidebar(false, true)
    this.props.getData(params,this.state.customer_id)
  }

  render() {
    let { show, handleSidebar, data } = this.props
    let { date, area, kj, cost, comments } = this.state
    return (
      <div
        className={classnames("data-list-sidebar", {
          show: show
        })}>
        <div className="data-list-sidebar-header mt-2 px-2 d-flex justify-content-between">
          <h4>{data !== null ? "UPDATE DATA" : "ADD NEW DATA"}</h4>
          <X size={20} onClick={() => handleSidebar(false, true)} />
        </div>
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
        <PerfectScrollbar
          className="data-list-fields px-2 mt-3"
          options={{ wheelPropagation: false }}>
          <FormGroup>
            <Label for="data-date">Date</Label>
            <Flatpickr
              required
              name="date"
              className="form-control"
              value={date}
              onChange={date => {
                this.setState({ date : date });
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-area">Area</Label>
            <Multiselect
              options={this.props.bodyarea} // Options to display in the dropdown
              selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
              onSelect={this.onSelect} // Function will trigger on select event
              onRemove={this.onRemove} // Function will trigger on remove event
              searchBox={{'border': 'none', 'fontSize': '10px', 'minHeight': '50px'}}
              displayValue="label" // Property name to display in the dropdown options
            />
          </FormGroup>
          <FormGroup>
            <Label for="data-skintype">Skin Type</Label>
            <Select
              id="skintype"
              className="React mr-3"
              classNamePrefix="select"
              value={this.state.selectedSkinTypeValue}
              name="skintype"
              options={skinTypes}
              onChange={e => {
                this.setState({ skintype: e.value })
                this.setState({ selectedSkinTypeValue: {value:e.value, label:e.value} })
              }}
              >
            </Select>
          </FormGroup>
          <FormGroup>
            <Label for="data-kj">KJ</Label>
            <Input
              type="number"
              id="data-kj"
              value={kj}
              onChange={e => this.setState({ kj: e.target.value })} />
          </FormGroup>
          <FormGroup>
            <Label for="data-cost">Cost</Label>
            <Input
              type="number"
              id="data-cost"
              value={cost}
              onChange={e => this.setState({ cost: e.target.value })} />
          </FormGroup>
          <FormGroup>
            <Label for="data-comments">Comments</Label>
            <Input
              type="text"
              id="data-comments"
              value={comments}
              onChange={e => this.setState({ comments: e.target.value })} />
          </FormGroup>
        </PerfectScrollbar>
      </div>
    )
  }
}
export default DataListSidebar
