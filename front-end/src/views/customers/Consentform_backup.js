import React from "react"
import "../../assets/scss/pages/authentication.scss"
import { getForm, submitConsentForm } from "../../redux/actions/client"
import consentLogo from "../../assets/img/logo/logo.png"
import { connect } from "react-redux"
import {
  Card,
  CardBody,
  FormGroup,
  Col,
  Input,
  Form,
  Button,
  Row
} from "reactstrap"

import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/light.css"
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import "../../assets/scss/custom.scss"
import Radio from "../../components/@vuexy/radio/RadioVuexy"
import {history} from "../../history"

import SignModal from './SignModal'
import jsPDF from 'jspdf'
import { toast } from 'react-toastify';
import Select from "react-select"
import SweetAlert from 'react-bootstrap-sweetalert';
import html2canvas from 'html2canvas';
// import LoadingOverlay from 'react-loading-overlay';

const referredby = [
  {value: "Google/website", label: "Google/website"},
  {value: "Facebook", label: "Facebook"},
  {value: "Instagram", label: "Instagram"},
  {value: "Kijiji", label: "Kijiji"},
  {value: "Walk-in", label: "Walk-in"},
  {value: "Word of mouth", label: "Word of mouth"}
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

class Consentform extends React.Component {

  constructor(props){
    super(props);
    let url = this.props.location.pathname.split(":")[1];
    this.props.getForm(url);
  }
  state = {
    topDate : getToday(),
    birthdate: getToday(),
    basicquestions: [],
    mediahistory: [],
    bodyarea: [],
    status: false,
    signModal: false,
    signUrl : '',
    name: '',
    email: '',
    defaultAlert : false,
    confirmAlert : false,
    cancelAlert : false,
    isActive: false
  }

  toggleModal = () => {
    this.setState(prevState => ({
      signModal: !prevState.signModal
    }))
  }

  handler = (value,target, url) => {
    console.log("URL: ", url);
    this.setState({ [target]: value,signUrl: url })
  }

  componentDidMount() {
    console.log("DIDMOUNT: ", this.state);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.props.response);
    if(!this.props.response.status){
      history.push('/error');
    }
  }

  handleAlert = (state, value) => {
    this.setState({ [state] : value })
  }

  async submit(){
    // this.setState({isActive: true});
    let formData = {};
    let contactsInfo = document.querySelectorAll('#contact-info input');
    let signInfo = document.querySelectorAll('#page2 input');
    let contactsInfoData = {}
    let signInfoData = {}

    contactsInfo.forEach(element => {
      contactsInfoData[element.getAttribute('name')] = element.value;
    });
    console.log("BodyArea:", this.state.bodyarea);
    contactsInfoData['bodyarea'] = this.state.bodyarea;
    formData['contactInfo'] = contactsInfoData;

    signInfo.forEach(element => {
      signInfoData[element.getAttribute('name')] = element.value;
    });
    signInfoData['sign'] = this.state.signUrl;
    formData['signInfo'] = signInfoData;

    // this.props.submitConsentForm({});
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');

    // const pdf = new jsPDF('p', 'pt', [ page1.offsetWidth+100,  page1.offsetHeight+200]);
    // if (pdf) {
    //   let imgPage1 = await domtoimage.toPng(page1,{width:page1.offsetWidth, height:page1.offsetHeight+50});
    //   let imgPage2 = await domtoimage.toPng(page2,{width:page2.offsetWidth, height:page2.offsetHeight+50});
    //     pdf.addImage(imgPage1, 'PNG', 50, 100);
    //     pdf.addPage();
    //     pdf.addImage(imgPage2, 'PNG', 50, 100);
    //     pdf.save('Skin Beauty Enhance Consent Form - '+this.state.name+'.pdf');
    //     formData['page1'] = imgPage1;
    //     formData['page2'] = imgPage2;
    //     this.props.submitConsentForm(formData);
    // }
    const doc = new jsPDF('p', 'px', 'a4');

    html2canvas(page1, {
      useCORS: true,
      allowTaint: true,
      scrollY: -window.scrollY,
    }).then(canvas => {
      const image = canvas.toDataURL('image/jpeg', 1.0);
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const widthRatio = pageWidth / canvas.width;
      const heightRatio = pageHeight / canvas.height;
      const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

      const canvasWidth = canvas.width * ratio;
      const canvasHeight = canvas.height * ratio;

      const marginX = (pageWidth - canvasWidth) / 2;
      const marginY = (pageHeight - canvasHeight) / 2;

      doc.addImage(image, 'JPEG', marginX, marginY, canvasWidth, canvasHeight);
      doc.addPage()

      html2canvas(page2, {
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
      }).then(canvas2 => {
        const image1 = canvas2.toDataURL('image/jpeg', 1.0);
        const pageWidth1 = doc.internal.pageSize.getWidth();
        const pageHeight1 = doc.internal.pageSize.getHeight();

        const widthRatio1 = pageWidth1 / canvas2.width;
        const heightRatio1 = pageHeight1 / canvas2.height;
        const ratio1 = widthRatio1 > heightRatio1 ? heightRatio1 : widthRatio1;

        const canvasWidth1 = canvas2.width * ratio1;
        const canvasHeight1 = canvas2.height * ratio1;

        const marginX1 = (pageWidth1 - canvasWidth1) / 2;
        const marginY1 = (pageHeight1 - canvasHeight1) / 2;

        doc.addImage(image1, 'JPEG', marginX1, marginY1, canvasWidth1, canvasHeight1);

        doc.save('Skin Beauty Enhance Consent Form - '+this.state.name+'.pdf');

        formData['page1'] = image;
        formData['page2'] = image1;
        formData['margin1'] = {w: canvasWidth, h: canvasHeight, mx: marginX, my: marginY};
        formData['margin2'] = {w: canvasWidth1, h: canvasHeight1, mx: marginX1, my: marginY1};
        this.props.submitConsentForm(formData);
      });
    });


  }

  async handleSubmit(e) {
    e.preventDefault();
    if(!this.state.signUrl){
      toast.warn('Please sign the consent form.');
      return;
    }

    this.setState({ defaultAlert : true });
  }

  render() {
    let {
      topDate,
      birthdate,
      signUrl,
      name,
      email
    } = this.state
    return (
      <Card style={{position:"absolute",top:"0",bottom:"0",left:"0",right:"0",overflow:"auto"}}>
        <CardBody className="container">
          <Form id="pdfbody" onSubmit={(e)=>this.handleSubmit(e)}>
            <div id="page1" className="pl-3 pr-3">
              <img src={consentLogo} alt="" style={{position:"absolute"}} />
              <div id="contact-info">
                <FormGroup row>
                  <Col md={{ size: 6, offset: 6 }} className="form-label-justify">
                    <span>Date:</span>
                  </Col>
                  <Col md="4" sm="4">
                    <Flatpickr
                      required
                      name="topdate"
                      className="form-control"
                      value={topDate}
                      onChange={date => {
                        this.setState({ topDate : date });
                      }}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md={{ size: 2, offset: 6 }} style={{display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                    <span>Referred by:</span>
                  </Col>
                  <Col md="4" sm="4">
                    {/* <Input
                      required
                      type="text"
                      name="referredby"
                      id="referredby"
                      placeholder=""
                    /> */}
                    <Select
                      className="React"
                      classNamePrefix="select"
                      name="referredby"
                      options={referredby}
                      >
                  </Select>
                  </Col>

                </FormGroup>
                <FormGroup row>
                  <Col md={{ size: 2}} className="form-label-justify">
                    <span>Name & Surname:</span>
                  </Col>
                  <Col md="10">
                    <Input
                      required
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={e => {this.setState({name: e.target.value})}}
                      placeholder="John Doe"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md={{ size: 2 }} className="form-label-justify">
                    <span>Address:</span>
                  </Col>
                  <Col md="6">
                    <Input
                      required
                      type="text"
                      name="address"
                      id="address"
                      placeholder=""
                    />
                  </Col>
                  <Col md="2" className="form-label-justify">
                    <span>Postal Code:</span>
                  </Col>
                  <Col md="2">
                    <Input
                      required
                      type="text"
                      name="postalcode"
                      id="postalcode"
                      placeholder="14523"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md={{ size: 1, offset: 1 }} className="form-label-justify">
                    <span>City:</span>
                  </Col>
                  <Col md="3">
                    <Input
                      required
                      type="text"
                      name="city"
                      id="city"
                      placeholder=""
                    />
                  </Col>
                  <Col md="1" className="form-label-justify">
                    <span>Phone:</span>
                  </Col>
                  <Col md="3">
                    <Input
                      required
                      type="number"
                      name="phone"
                      id="phone"
                      placeholder=""
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md={{ size: 2 }} className="form-label-justify">
                    <span>Areas to be treated:</span>
                  </Col>
                  <Col md="8">
                    <Select
                      className="React mr-3"
                      classNamePrefix="select"
                      isMulti
                      name="bodyarea"
                      options={this.props.response.bodyarea}
                      onChange={e => {this.setState({bodyarea: e})}}
                      >
                    </Select>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md={{ size: 2 }} className="form-label-justify">
                    <span>Date of birth:</span>
                  </Col>
                  <Col md="3" sm="12">
                    <Flatpickr
                      required
                      name="birthdate"
                      className="form-control"
                      value={birthdate}
                      onChange={date => {
                        this.setState({ birthdate : date });
                      }}
                    />
                  </Col>
                  <Col md="1" className="form-label-justify">
                    <span>Email:</span>
                  </Col>
                  <Col md="4">
                    <Input
                      required
                      type="email"
                      name="email"
                      id="Email"
                      placeholder="Email"
                      value={email}
                      onChange={e => {this.setState({email: e.target.value})}}
                    />
                  </Col>
                </FormGroup>
              </div>
          <Row>
            {
              this.props.response.basicquestions?
                this.props.response.basicquestions.map((Item, i)=>{
                  if(Item.category === 'Check'){
                      if(i % 2 === 0)
                        return (
                              <Col md='6' key={i} className="row">
                                <Col  md='8' className="form-label-justify"> {Item.question} </Col>
                                <Col  md='4'>
                                    <div className="d-inline-block mr-1">
                                      <Radio label="Yes" defaultChecked={false} name={Item._id} />
                                    </div>
                                    <div className="d-inline-block mr-1">
                                      <Radio label="No" defaultChecked={false} name={Item._id} />
                                    </div>
                                  </Col>
                                </Col>
                            )
                      else{
                        return (
                          <Col md='6' key={i} className="row">
                            <Col  md='6' className="form-label-justify"> {Item.question} </Col>
                            <Col  md='6'>
                                <div className="d-inline-block mr-1">
                                  <Radio label="Yes" defaultChecked={false} name={Item._id} />
                                </div>
                                <div className="d-inline-block mr-1">
                                  <Radio label="No" defaultChecked={false} name={Item._id} />
                                </div>
                              </Col>
                            </Col>
                        )
                      }
                    }
                    else{
                      if(i % 2 === 0){
                        return (<Col  md='6'  key={i} className="row">
                                  <Col  md='8' className="form-label-justify"> {Item.question} </Col>
                                  <Col  md='4' >
                                    <Input type="text" name={Item.question} id={Item._id} />
                                  </Col>
                                </Col>)
                      }
                      else{
                        return (<Col  md='6'  key={i} className="row">
                                  <Col  md='6' className="form-label-justify"> {Item.question} </Col>
                                  <Col  md='6' >
                                    <Input type="text" name={Item.question} id={Item._id} />
                                  </Col>
                                </Col>)
                      }
                    }
                  }
                ):null
            }
          </Row>
            <h3 className="text-center mt-2" >Medical History</h3>
            {/* Mdical History */}
            <Row>
            {
              this.props.response.mediahistory?
                this.props.response.mediahistory.map((Item, i)=>{
                      if(i % 2 === 0)
                        return (
                              <Col md='6' key={i} className="row">
                                <Col  md='8' className="form-label-justify"> {Item.question} </Col>
                                <Col  md='4'>
                                    <div className="d-inline-block mr-1">
                                      <Radio label="Yes" defaultChecked={false} name={Item._id} />
                                    </div>
                                    <div className="d-inline-block mr-1">
                                      <Radio label="No" defaultChecked={false} name={Item._id} />
                                    </div>
                                  </Col>
                                </Col>
                            )
                      else{
                        return (
                          <Col md='6' key={i} className="row">
                            <Col  md='4' className="form-label-justify"> {Item.question} </Col>
                            <Col  md='4'>
                                <div className="d-inline-block mr-1">
                                  <Radio label="Yes" defaultChecked={false} name={Item._id} />
                                </div>
                                <div className="d-inline-block mr-1">
                                  <Radio label="No" defaultChecked={false} name={Item._id} />
                                </div>
                              </Col>
                            </Col>
                        )
                      }
                  }
                ):null
            }
          </Row>
          <FormGroup row className="mt-3">
              <Col md="4" className="form-label-justify">
                  <span>Comment:</span>
                </Col>
                <Col md="6">
                  <Input
                    type="text"
                    name="comment"
                    id="comment"
                    placeholder=""
                  />
                </Col>
            </FormGroup>
            </div>
            <div id="page2" className="pl-3 pr-3">
            <h2 className="text-center mt-3 mb-3">Consent for Laser Hair Removal</h2>
            <Row className="container" style={{margin:"0 auto"}}>
              <p>
              I understand that Soprano Lite is a device used for laser treatment and the clinical results may vary in
different skin types. I understand there is possibility of short term effects such as blistering, scabbing,
temporary bruising and temporary discoloration of the skin, as well as uncommon side effects such as
scarring and permanent discoloration.
              </p>
              <p>
              I certify that I have been fully informed of the nature and purpose of the procedure, expected outcomes
and possible complications and I understand that no guarantee can be given as to the final result
obtained. I’m fully aware that my condition is a cosmetic concern, and that the decision to proceed is
based solely on my expressed desire to do so.
              </p>
              <p>
              Clinical results may vary depending on individual factors including medical history, skin type, hair type,
patient compliance with pre/post treatment instructions, as well as patient commitment and individual
response to treatment.
              </p>
              <p>
              I confirm that I’m not pregnant at this time, and that I have not taken Accutane within the last 6 months.
I do not have a pacemaker or internal defibrillators.
              </p>
              <p>
              I consent to the taking photographs and authorized their anonymous use for the purpose of medical
audit, education and promotion.
              </p>
              <p>
              I consent that I have been given the opportunity to ask questions and that I have read and fully
understand the contents of this form.
              </p>
              <br />
              <br />
              <br />
              <b>
              I hereby certify that all information that I have provided has been accurate and truthful. I
acknowledge the above risks, conditions, limitations, and complications. I further acknowledge that
these risks, conditions, limitations and complications have been explained to me and that I accept
these risks and consent to treatment.
I agree to follow all post treatment care instructions provided to me. I also acknowledge that I have
been provided adequate time to read, understand and accepts the above risks, conditions, limitations
and complications.
              </b>
            </Row>
            <FormGroup row className="mt-3">
                <Col md={{ size: 1, offset: 2 }} className="form-label-justify">
                  <span>Name:</span>
                </Col>
                <Col md="6">
                  <Input
                    type="text"
                    name="sign_name"
                    id="sign_name"
                    placeholder="John Doe"
                    value={name}
                    readOnly
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-3">
                <Col md={{ size: 1, offset: 2 }} className="form-label-justify">
                  <span>Date:</span>
                </Col>
                <Col md="2" sm="4">
                  <Input
                      type="text"
                      name="signdate"
                      id="sign_name"
                      value={topDate}
                      readOnly
                    />
                </Col>
                <Col md={{size:4, offset:1}} className='row'>
                  <Col md='4'>
                    <Button.Ripple
                      color="primary"
                      type="button"
                      className="mr-1 mb-1"
                      onClick={this.toggleModal}
                    >
                    Signature
                  </Button.Ripple>
                  </Col>
                  <Col md='8'>
                    {signUrl !== '' ? <img src={signUrl} alt='Sign' width='150' height='50'/> : ''}

                  </Col>
                </Col>
              </FormGroup>
            </div>

              <SignModal {...this.state} handler={(v,t,url)=>this.handler(v,t,url)}/>

            <FormGroup row>
              <Col md={{ size: 8, offset: 4 }}>
                      <Button.Ripple
                      color="primary"
                      type="submit"
                      className="mr-1 mb-1"
                      // onClick={()=>this.handleSubmit(this.printDocument)}
                    >
                      Submit
                    </Button.Ripple>

                <Button.Ripple
                  outline
                  color="warning"
                  type="reset"
                  className="mb-1"
                >
                  Reset Form
                </Button.Ripple>
              </Col>
            </FormGroup>
          </Form>
          <SweetAlert title="Are you sure?"
            warning
            show={this.state.defaultAlert}
            showCancel
            reverseButtons
            cancelBtnBsStyle="danger"
            confirmBtnText="Yes, Submit!"
            cancelBtnText="Cancel"
            onConfirm={() => {
              this.handleAlert("basicAlert", false)
              this.handleAlert("defaultAlert", false)
              // this.handleAlert("confirmAlert", true)
              this.submit()
            }}
            onCancel={() => {
              this.handleAlert("basicAlert", false)
              this.handleAlert("defaultAlert", false)
            }}
          >
            You won't be able to revert this!
        </SweetAlert>

        <SweetAlert success title="Deleted!"
          confirmBtnBsStyle="success"
          show={this.state.confirmAlert}
          onConfirm={() => {
            this.handleAlert("defaultAlert", false)
            this.handleAlert("confirmAlert", false)
          }}
        >
            <p className="sweet-alert-text">Your file has been deleted.</p>
        </SweetAlert>

        <SweetAlert error title="Cancelled"
          confirmBtnBsStyle="success"
          show={this.state.cancelAlert}
          onConfirm={() =>{
            this.handleAlert("defaultAlert", false)
            this.handleAlert("cancelAlert", false)
          }}
        >
            <p className="sweet-alert-text">
              Your imaginary file is safe :)
            </p>
        </SweetAlert>


        </CardBody>
      </Card>
    )
  }
}

const mapStateToProps = (state) => (
{
  response : state.client
})
export default connect(mapStateToProps, { getForm,submitConsentForm })(Consentform)
