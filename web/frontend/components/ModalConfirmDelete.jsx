import { Button, ButtonGroup, Modal, TextContainer } from "@shopify/polaris";
import React, { useCallback } from "react";

export default function ModalConfirmDelete(props) {
  const { setOpen, id, handleDelete, title, groupName, isDeleteWidget } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const confirmDelete = useCallback(() => {
    handleDelete();
    setOpen(false);
  }, []);

  return (
    <div style={{ height: "300px" }} className="modal-confirm-delete">
      <Modal
        open={true}
        onClose={handleClose}
        title={title}
        footer={
          <div style={{display: 'flex', justifyContent: 'end'}}>
            <ButtonGroup>
              <Button onClick={handleClose}>Cancel</Button>
              <Button destructive onClick={confirmDelete}>
                Yes, Delete
              </Button>
            </ButtonGroup>
          </div>
        }
      >
        <Modal.Section>
          <TextContainer>
            <p>
              {groupName
                ? `Are you sure you want to remove this group ${groupName} and all group data? This can not be undone.`
                : isDeleteWidget
                ? "Are you sure you want to remove this widget? This can not be undone."
                : "Are you sure you want to remove this FAQ? This can not be undone."}
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  );
}
