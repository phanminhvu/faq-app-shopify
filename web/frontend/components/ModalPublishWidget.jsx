import {
  Banner,
  Card,
  DisplayText,
  Icon,
  Link,
  Modal,
  Stack,
  TextContainer,
  TextStyle,
} from "@shopify/polaris";
import { CirclePlusMajor } from "@shopify/polaris-icons";
import React from "react";

export default function ModalPublishWidget(props) {
  const { setOpen, widgetId, isPublishCheckout, isViewOnboard } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const renderItemHeading = (title) => {
    return (
      <Stack alignment="center">
        <Icon source={CirclePlusMajor} />
        <DisplayText size="small">
          <strong>{title}</strong>
        </DisplayText>
      </Stack>
    );
  };

  return (
    <div className="modal-confirm-delete">
      {isViewOnboard ? <div> <Card.Section title="Accordion ID">
        {widgetId && <TextStyle variation="code">{widgetId}</TextStyle>}
      </Card.Section>
        <Card.Section title="Code Snippet">
          {widgetId && (
            <TextStyle variation="code">{`<div class="simesy-faq-widget" data-widget-id="${widgetId}"></div>`}</TextStyle>
          )}
        </Card.Section>
        <Card.Section title="Guides">
          <TextContainer>
            <p>
              <Link
                external
                url="https://simesy-agency.freshdesk.com/support/solutions/articles/73000541362-how-to-show-faqs-on-homepage-"
              >
                How to show FAQs on homepage?
              </Link>
            </p>
            <p>
              <Link
                external
                url="https://simesy-agency.freshdesk.com/support/solutions/articles/73000541367-how-to-show-faqs-on-product-page-"
              >
                How to show FAQs on product page?
              </Link>
            </p>
          </TextContainer>
        </Card.Section> </div> :
        <Modal
          large
          open={true}
          onClose={handleClose}
          title={isPublishCheckout ? "Publish Checkout" : "Install Accordion"}
          secondaryActions={{
            content: "Cancel",
            onAction: handleClose,
          }}
        >
          {/* <Modal.Section> */}
          <Card.Section>
            <Banner title="Free install service" status="info">
              Need some assistance installing and styling FAQ accordion? Please message us for free assistance.
            </Banner>
          </Card.Section>
          <Card.Section title="Accordion ID">
            {widgetId && <TextStyle variation="code">{widgetId}</TextStyle>}
          </Card.Section>
          <Card.Section title="Accordion Code Snippet">
            {widgetId && (
              <TextStyle variation="code">{`<div class="simesy-faq-widget" data-widget-id="${widgetId}"></div>`}</TextStyle>
            )}
          </Card.Section>
          <Card.Section title="Guides">
            <TextContainer>
              <p>
                <Link
                  external
                  url="https://simesy-agency.freshdesk.com/support/solutions/articles/73000541362-how-to-show-faqs-on-homepage-"
                >
                  How to show FAQs on homepage?
                </Link>
              </p>
              <p>
                <Link
                  external
                  url="https://simesy-agency.freshdesk.com/support/solutions/articles/73000596141-how-to-add-faqs-to-product-page-"
                >
                  How to show FAQs on product page?
                </Link>
              </p>
              {/* <p><Link external url="https://www.simesy.com/simesy-faqs-app-documentation/#adding-widgets-to-page">How to show FAQs on page?</Link></p> */}
              {/* <p><Link external url="https://www.simesy.com/simesy-faqs-app-documentation/#adding-widgets-to-cart-page">How to show FAQs on cart page?</Link></p> */}
            </TextContainer>
          </Card.Section>

          {/* </Modal.Section> */}
        </Modal>}
    </div>
  );
}
