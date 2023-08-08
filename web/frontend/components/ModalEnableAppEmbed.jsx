import React, { useState } from "react";
import { Button, Modal, TextContainer, Stack, ButtonGroup } from "@shopify/polaris";

export default function ModalEnableAppEmbed(props) {
  const { enableApp, url, checkEnableApp, setEnableApp } = props;
  const [checking, setChecking] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const onClickEnable = () => {
    window.open(url, "_blank");
    setShowButton(false);
  }

  const validate = async () => {
    setChecking(true);
    await checkEnableApp();
    if (!enableApp) {
      setShowButton(true);
    }
    setChecking(false);
  }

  return (
    <Modal open={true} title="Enable app embed">
      <Modal.Section >
        <TextContainer>
          <p>
            For FAQ accordion to display, the app embed must be activated in your <strong>theme settings</strong> section. Find it in the <strong>App embeds</strong> tab under the Theme settings section.
          </p>
          <p>
            <strong>Don't forget to PRESS SAVE.</strong>
          </p>
          {showButton && (
            <ButtonGroup>
              <Button primary onClick={onClickEnable}>Enable app embed</Button>
              <Button plain onClick={setEnableApp}>I'll do it later</Button>
            </ButtonGroup>
          )}
          {!showButton && (
            <ButtonGroup>
              <Button loading={checking} primary onClick={validate}>Validate app embed</Button>
              <Button plain onClick={setEnableApp}>I'll do it later</Button>
            </ButtonGroup>
          )}
        </TextContainer>
      </Modal.Section>
    </Modal>
  )
}
