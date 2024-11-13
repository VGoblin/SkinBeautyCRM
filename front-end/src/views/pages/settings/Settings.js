import React from "react"
import { Row, Col } from "reactstrap"
import BodyAreaListViewConfig from "./BodyAreaDataListConfig"
import BasicDataListViewConfig from "./BasicDataListConfig"
import MediaHistoryDataListViewConfig from "./MediaHistoryDataListConfig"

import queryString from "query-string"

class Settings extends React.Component{
  render(){
    return (
      <React.Fragment>
        {/* <Breadcrumbs
          breadCrumbTitle="Settings"
          breadCrumbParent="Pages"
          breadCrumbActive="Settings"
        /> */}
        <Row>
          <Col sm="6">
            <h5 className="text-center">Body Area</h5>
            <BodyAreaListViewConfig parsedFilter={queryString.parse(this.props.location.search)}/>
          </Col>
          <Col sm="6">
            <h5 className="text-center">Basic Health Questions</h5>
            <BasicDataListViewConfig parsedFilter={queryString.parse(this.props.location.search)}/>
          </Col>
          <Col sm="12" className="mt-2">
            <h5 className="text-center">Medical History Questions</h5>
            <MediaHistoryDataListViewConfig parsedFilter={queryString.parse(this.props.location.search)}/>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default Settings
