import React from "react"
import { Row, Col } from "reactstrap"
import ListViewConfig from "./DataListConfig"
import queryString from "query-string"

class Sessions extends React.Component{
  render(){
    return (
      <React.Fragment>
        <Row>
          <Col sm="12">
            <ListViewConfig parsedFilter={queryString.parse(this.props.location.search)}/>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default Sessions