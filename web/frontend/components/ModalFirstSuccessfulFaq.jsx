import { Modal, TextContainer } from "@shopify/polaris";
import React from "react";
import PopoverNextStep from "./PopoverNextStep";
import FAQ from "../assets/img/faq.png";

export default function ModalFirstSuccessfulFaq(props) {
  const { setOpen, router, hideAddMore } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ height: "500px" }} className="modal-first-successful-faq">
      <Modal
        open={true}
        // onClose={handleClose}
        title="Congratulations! FAQ created successfully."
      >
        <Modal.Section>
          <TextContainer>
            <p style={{"font-weight": "600", "font-size": "1.75rem"}}><strong>What do you want to do next ?</strong></p>
            <PopoverNextStep hideAddMore={hideAddMore} close={handleClose} router={router} />
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  );
}
