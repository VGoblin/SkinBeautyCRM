import React, { Component } from "react"
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Input,
  Button,
} from "reactstrap"
import DataTable from "react-data-table-component"
import classnames from "classnames"
import ReactPaginate from "react-paginate"
import { history } from "../../../history"
import {
  Edit,
  Trash,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus
} from "react-feather"
import { connect } from "react-redux"
import {
  getCustomers,
  getData,
  deleteData,
  updateData,
  addData,
  filterData
} from "../../../redux/actions/sessions"
import Sidebar from "./DataListSidebar"

import "../../../assets/scss/plugins/extensions/react-paginate.scss"
import "../../../assets/scss/pages/data-list.scss"
import "../../../assets/scss/custom.scss"
import Select from "react-select"
import { toast } from "react-toastify"

const selectedStyle = {
  rows: {
    selectedHighlighStyle: {
      backgroundColor: "rgba(115,103,240,.05)",
      color: "#7367F0 !important",
      boxShadow: "0 0 1px 0 #7367F0 !important",
      "&:hover": {
        transform: "translateY(0px) !important"
      }
    }
  }
}

const ActionsComponent = props => {
  return (
    <div className="data-list-action">
      <Edit
        className="cursor-pointer mr-1"
        size={20}
        onClick={() => {
          return props.currentData(props.row)
        }}
      />
      <Trash
        className="cursor-pointer"
        size={20}
        onClick={() => {
          props.deleteRow(props.row)
        }}
      />
    </div>
  )
}

const CustomHeader = props => {
  let customers = props.customers;
  let selects = [];
  customers.forEach(customer => {
    selects.push({value:customer._id, label:customer.name})
  });

  return (
    <div className="data-list-header d-flex justify-content-between flex-wrap">
      <div className="actions-left d-flex flex-wrap">
        <Select
          className="React mr-3 customer-select"
          classNamePrefix="select"
          defaultValue={selects.length > 0 ? selects[0]: ''}
          name="customers"
          style={{width:'400px'}}
          options={selects}
          onChange={e => props.handleCustomerChnage(e.value)}>
        </Select>
      <Button
        className="add-new-btn"
        color="primary"
        onClick={() => props.handleSidebar(true, true)}
        outline>
        <Plus size={15} />
        <span className="align-middle">Add New</span>
      </Button>
      </div>
      <div className="actions-right d-flex flex-wrap mt-sm-0 mt-2">
        <UncontrolledDropdown className="data-list-rows-dropdown mr-1 d-md-block d-none">
          <DropdownToggle color="" className="sort-dropdown">
            <span className="align-middle mx-50">
              {`${props.index[0] || 0} - ${props.index[1] || 0} of ${props.total}`}
            </span>
            <ChevronDown size={15} />
          </DropdownToggle>
          <DropdownMenu tag="div" right>
            <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(4)}>
              4
            </DropdownItem>
            <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(10)}>
              10
            </DropdownItem>
            <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(15)}>
              15
            </DropdownItem>
            <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(20)}>
              20
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
        <div className="filter-section">
          <Input type="text" onChange={e => props.handleFilter(e)} />
        </div>
      </div>
    </div>
  )
}

class DataListConfig extends Component {

  state = {
    data: [],
    customers: [],
    bodyarea: [],
    totalPages: 0,
    currentPage: 0,
    columns: [
      {
        name: "Date",
        selector: "date",
        sortable: true,
      },
      {
        name: "Area",
        selector: "areanames",
        sortable: true
      },
      {
        name: "Skin Type",
        selector: "skintype",
        sortable: true
      },
      {
        name: "KJ",
        selector: "kj",
        sortable: true
      },
      {
        name: "Cost",
        selector: "cost",
        sortable: true
      },
      {
        name: "Comments",
        selector: "comments",
        sortable: true
      },
      {
        name: "Actions",
        sortable: true,
        cell: row => (
          <ActionsComponent
            row={row}
            getData={this.props.getData}
            parsedFilter={this.props.parsedFilter}
            currentData={this.handleCurrentData}
            deleteRow={this.handleDelete}
          />
        )
      }
    ],
    allData: [],
    value: "",
    rowsPerPage: 4,
    sidebar: false,
    currentData: null,
    selected: [],
    totalRecords: 0,
    sortIndex: [],
    addNew: "",
    customer_id: ""
  }


  static getDerivedStateFromProps(props, state) {
    if (props.dataList.data.length !== state.data.length || state.currentPage !== props.parsedFilter.page) {
      return {
        data: props.dataList.data,
        customers: props.dataList.customers,
        bodyarea: props.dataList.bodyarea,
        allData: props.dataList.filteredData,
        totalPages: props.dataList.totalPages,
        currentPage: parseInt(props.parsedFilter.page) - 1,
        rowsPerPage: parseInt(props.parsedFilter.perPage),
        totalRecords: props.dataList.totalRecords,
        sortIndex: props.dataList.sortIndex
      }
    }

    // Return null if the state hasn't changed
    return null
  }


  thumbView = this.props.thumbView

  componentDidMount() {

    // this.props.getData(this.props.parsedFilter)
    this.props.getCustomers()
  }


  handleFilter = e => {
    this.setState({ value: e.target.value })
    this.props.filterData(e.target.value)
  }

  handleRowsPerPage = value => {
    let { parsedFilter, getData } = this.props
    let page = parsedFilter.page !== undefined ? parsedFilter.page : 1
    history.push(`?page=${page}&perPage=${value}`)
    this.setState({ rowsPerPage: value })
    getData({ page: parsedFilter.page, perPage: value }, this.state.customer_id)
  }

  handleCustomer = (customer_id) => {
    console.log("OKOOK", customer_id);
    this.setState({customer_id: customer_id});
    this.props.getData(this.props.parsedFilter, customer_id);
  }

  handleSidebar = (boolean, addNew = false) => {
    if(this.state.customer_id === ''){
        toast.warn('Choose a customer.')
        return
    }
    this.setState({ sidebar: boolean })
    if (addNew === true) this.setState({ currentData: null, addNew: true })
  }

  handleDelete = row => {
    this.props.deleteData(row)
    this.props.getData(this.props.parsedFilter, this.state.customer_id)
    if (this.state.data.length - 1 === 0) {
      let urlPrefix = this.props.thumbView
        ? ""
        : ""
      history.push(
        `${urlPrefix}?page=${parseInt(
          this.props.parsedFilter.page - 1
        )}&perPage=${this.props.parsedFilter.perPage}`
      )
      this.props.getData({
        page: this.props.parsedFilter.page - 1,
        perPage: this.props.parsedFilter.perPage
      }, this.state.customer_id)
    }
  }

  handleCurrentData = obj => {
    this.setState({ currentData: obj })
    this.handleSidebar(true)
  }

  handlePagination = page => {
    let { parsedFilter, getData } = this.props
    let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 4
    let urlPrefix = this.props.thumbView
      ? ""
      : ""
    history.push(
      `${urlPrefix}?page=${page.selected + 1}&perPage=${perPage}`
    )

    getData({ page: page.selected + 1, perPage: perPage }, this.state.customer_id)
    this.setState({ currentPage: page.selected })
  }

  render() {
    let {
      columns,
      data,
      customers,
      allData,
      totalPages,
      value,
      rowsPerPage,
      currentData,
      sidebar,
      totalRecords,
      sortIndex
    } = this.state
    return (
      <div
        className={`data-list ${
          this.props.thumbView ? "thumb-view" : "list-view"
        }`}>
        <DataTable
          columns={columns}
          data={value.length ? allData : data}
          pagination
          paginationServer
          paginationComponent={() => (
            <ReactPaginate
              previousLabel={<ChevronLeft size={15} />}
              nextLabel={<ChevronRight size={15} />}
              breakLabel="..."
              breakClassName="break-me"
              pageCount={totalPages}
              containerClassName="vx-pagination separated-pagination pagination-end pagination-sm mb-0 mt-2"
              activeClassName="active"
              forcePage={
                this.props.parsedFilter.page
                  ? parseInt(this.props.parsedFilter.page - 1)
                  : 0
              }
              onPageChange={page => this.handlePagination(page)}
            />
          )}
          noHeader
          subHeader
          responsive
          pointerOnHover
          selectableRowsHighlight
          onSelectedRowsChange={data =>
            this.setState({ selected: data.selectedRows })
          }
          customStyles={selectedStyle}
          subHeaderComponent={
            <CustomHeader
              handleSidebar={this.handleSidebar}
              handleFilter={this.handleFilter}
              handleRowsPerPage={this.handleRowsPerPage}
              handleCustomerChnage={this.handleCustomer}
              rowsPerPage={rowsPerPage}
              total={totalRecords}
              index={sortIndex}
              customers={customers}
            />
          }
          sortIcon={<ChevronDown />}
          selectableRowsComponentProps={{
            color: "primary",
            icon: <Check className="vx-icon" size={12} />,
            label: "",
            size: "sm"
          }}
        />
        <Sidebar
          show={sidebar}
          data={currentData}
          updateData={this.props.updateData}
          addData={this.props.addData}
          handleSidebar={this.handleSidebar}
          thumbView={this.props.thumbView}
          getData={this.props.getData}
          dataParams={this.props.parsedFilter}
          addNew={this.state.addNew}
          customer_id={this.state.customer_id}
          bodyarea={this.state.bodyarea||[]}
        />
        <div
          className={classnames("data-list-overlay", {
            show: sidebar
          })}
          onClick={() => this.handleSidebar(false, true)}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  console.log(state.sessions)
  return {
    dataList: state.sessions
  }
}

export default connect(mapStateToProps, {
  getCustomers,
  getData,
  deleteData,
  updateData,
  addData,
  filterData
})(DataListConfig)
