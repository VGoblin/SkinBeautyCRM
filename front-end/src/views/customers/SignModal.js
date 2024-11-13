import React from "react"
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap"
import SignatureCanvas from 'react-signature-canvas'

class SignModal extends React.Component {
  state = {
    activeTab: "1",
    signModal: false
  }

  sigPad = {}

  clear = () => {
    this.sigPad.clear()
  }

  sign = () => {
    this.props.handler(!this.props.signModal,'signModal',this.sigPad.getTrimmedCanvas()
    .toDataURL('image/png'))
  }


  toggleModal = () => {
    this.setState(prevState => ({
        signModal: !prevState.signModal
    }))
  }

  render() {
    return (
        <Modal
            isOpen={this.props.signModal}
            toggle={()=>this.props.handler(!this.props.signModal,'signModal','')}
            className="modal-dialog-centered modal-lg"
        >
            <ModalHeader toggle={()=>this.props.handler(!this.props.signModal,'signModal','')}>
            Sign here
            </ModalHeader>
            <ModalBody>
                <SignatureCanvas penColor='black'
                    canvasProps={{width: 800, height: 300, className: 'sigCanvas'}}  ref={(ref) => { this.sigPad = ref }} />
            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={this.clear}>
                Clear
            </Button>
            <Button color="primary" onClick={this.sign}>
                Sign
            </Button>{" "}
            </ModalFooter>
        </Modal>
    )
  }
}

export default SignModal
