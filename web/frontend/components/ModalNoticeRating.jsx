import { Button, Icon, Link, Modal, TextContainer } from "@shopify/polaris"
import { StarFilledMinor } from "@shopify/polaris-icons";

const ModalNoticeRating = ({handleClose}) => {

  const handleRedirect = () => {
    window.open("https://apps.shopify.com/frequentlify?#modal-show=ReviewListingModal")
  }
    return (
      <Modal
        open={true}
        onClose={handleClose}
        small
      >
        <Modal.Section>
          <div className="modal-rating">
            <h2>We ⭐ you too</h2>
            <p>We feedback means a lot to us! Please take a minute to leave us a review on the Shopify App Store</p>
            <Button onClick={handleRedirect} primary>Write a review</Button>
            <Link url="" onClick={handleClose}>Maybe Later</Link>
          </div>
        </Modal.Section>
      </Modal>
    )
}

export default ModalNoticeRating;