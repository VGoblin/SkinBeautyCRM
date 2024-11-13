import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Col,
  Input,
  Form,
  Button
} from "reactstrap"
import { connect } from "react-redux"
import { generateUrl,isOpened,timeLeft } from "../../redux/actions/customer"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { toast } from 'react-toastify';

class Home extends React.Component{
  constructor(){
    super();
    this.state={
      sessionTime : 20,
      value: '',
      copied: false
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.newUrl !==this.props.newUrl){
      this.setState({value : this.props.newUrl})
    }
  }

  handleGenerateUrl = e => {
    e.preventDefault()
    this.props.generateUrl(
      this.state.sessionTime
    )
  }

  handleIsOpened = () => {
    if(!this.state.value){
      toast.error('There is no generated url');
      return
    }
    let uri = this.state.value.split('/:')[1]
    this.props.isOpened(
      uri
    )
  }

  handleTimeLeft = () => {
    if(!this.state.value){
      toast.error('There is no generated url');
      return
    }
    let uri = this.state.value.split('/:')[1]
    this.props.timeLeft(
      uri
    )
  }

  handleCopy = ({ target: { value } }) => {
    this.setState({ value, copied: false })
  }

  onCopy = () => {
    this.setState({ copied: true })
    toast.success("Text Copied Successfully", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000
    })
  }

  render(){
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generate Temporary Url</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={this.handleGenerateUrl}>
            <FormGroup row>
              <Col md="2">
                <span>Generated Temporary Url</span>
              </Col>
              <Col md="10">
                <Input
                  type="text"
                  name="generated_url"
                  id="generated_url"
                  placeholder="Generated Url"
                  value={this.state.value}
                  onChange={this.handleCopy}
                  readOnly
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md="2">
                <span>Session Time</span>
              </Col>
              <Col md="8">
                <Input
                  type="number"
                  name="expire"
                  id="expire_time"
                  placeholder="Expire time"
                  value={this.state.sessionTime}
                  onChange={(e)=>this.setState({sessionTime:e.target.value})}
                />
              </Col>
              <Col md="2">
                <Button.Ripple
                  color="primary"
                  className="mr-1 mb-1"
                  type="submit"
                >
                  Generate
                </Button.Ripple>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md={{ size: 8, offset: 2 }}>
                <CopyToClipboard onCopy={this.onCopy} text={this.state.value} >
                      <Button.Ripple color="primary" className="mr-1 mb-1" >
                        Copy Url
                      </Button.Ripple>
                </CopyToClipboard>

                <Button.Ripple
                  outline
                  color="warning"
                  type="reset"
                  className="mr-1 mb-1"
                  onClick={()=>this.handleIsOpened()}
                >
                  URL opened?
                </Button.Ripple>
                <Button.Ripple
                  outline
                  color="warning"
                  type="reset"
                  className="mb-1"
                  onClick={()=>this.handleTimeLeft()}
                >
                  Time Remaining
                </Button.Ripple>
              </Col>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    )
  }
}
const mapStateToProps = (state) => (
  {
  newUrl : state.customer.newGeneratedUrl
  }
)
export default connect(mapStateToProps, { generateUrl,isOpened, timeLeft })(Home)
