import React, { useState } from "react";
import { Button, Modal, TextContainer, Stack, ButtonGroup, Heading, List } from "@shopify/polaris";

export default function ModalEnableAppEmbed(props) {
  const { enableApp, url, checkEnableApp, setEnableApp } = props;
  const [open, setOpen] = useState(true);
  const [showButton, setShowButton] = useState(true);

  const onClickEnable = () => {
    window.open(url, "_blank");
  }

  const onClose = () => {
    setOpen(false);
  }

  const onActionReadFullGuide = () => {
    window.open("https://docs.simesy.com/article/4-getting-started", "_blank");
  }

  return (
    <div id="getting-started-modal">
      <Modal open={open} title="Getting started" onClose={onClose}
        secondaryActions={[
          {
            content: "Read full guide",
            onAction: onActionReadFullGuide,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <Heading>Step 1/4: Enable app embed</Heading>
            <p>
              For FAQ accordion to display, the app embed must be activated in your <strong>theme settings</strong> section. Find it in the <strong>App embeds</strong> tab under the Theme settings section.
            </p>
            <p>
              <strong>Don't forget to PRESS SAVE.</strong>
            </p>
            <Button primary onClick={onClickEnable}>Enable app embed</Button>
          </TextContainer>
        </Modal.Section>
        <Modal.Section>
          <TextContainer>
            <Heading>Step 2/4: Create an FAQ Group</Heading>
            <p>To get started, click on <strong>Add FAQ Group</strong></p>
            <img loading="lazy" style={{"width": "100%"}} src="https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/73056566006/original/qQEEYaRl-dT1uywJ2VftQnrTRLapptsgyw.png?1684516350" />
          </TextContainer>
        </Modal.Section>
        <Modal.Section>
          <TextContainer>
            <Heading>Step 3/4: Add FAQ items to a Group</Heading>
            <p>Click on the <strong>Add New FAQ button</strong> within the FAQ Group you wish to add an FAQ item.</p>
            <img loading="lazy" style={{"width": "100%"}} src="https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/73056566813/original/rxM9-jwKSiWxtflPwU_a_yTd-3QgaR4PMA.png?1684516652" />
          </TextContainer>
        </Modal.Section>
        <Modal.Section>
          <TextContainer>
            <Heading>Step 4/4: Display FAQs</Heading>
            <List>
              <List.Item>Create a dedicated FAQ page to show all FAQs for your online store. <a target="_blank" href="https://docs.simesy.com/article/5-how-to-create-a-faq-page">See how</a>.</List.Item>
              <List.Item>Create a FAQ accordion to show FAQs on any page. <a target="_blank" href="https://docs.simesy.com/article/6-how-to-create-a-faq-accordion">See how</a>.</List.Item>
            </List>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  )
}
