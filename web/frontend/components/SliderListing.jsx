import {
  Button,
  ButtonGroup,
  Card,
  DisplayText,
  FormLayout,
  Frame,
  Icon,
  IndexTable,
  Layout,
  Page,
  ResourceItem,
  ResourceList,
  TextStyle,
  Toast,
  useIndexResourceState,
  Banner,
  Modal,
  Link,
  TextContainer
} from "@shopify/polaris";
import { DeleteMinor, EditMinor } from "@shopify/polaris-icons";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

import moment from "moment";
import router from "next/router";
import ModalConfirmDelete from "./ModalConfirmDelete";
import mixpanel from "mixpanel-browser";

const heading = [
  { title: "Title" },
  { title: "Code" },
  { title: "Date" },
  { title: "" },
];

const resourceName = {
  singular: "customer",
  plural: "customers",
};

const SliderListing = (props) => {
  // const NODE_ENV = "development";
  const app = NODE_ENV === "development" ? null : null;
  const {
    data: { shop },
    slider,
    setSlider,
    authAxios
  } = props;
  const [activeError, setActiveError] = useState(false);
  const [activeSuccess, setActiveSuccess] = useState(false);
  const [openDelete, SetOpenDelete] = useState(false);
  const [idSilerDelete, setIdSliderDelete] = useState("");
  const [faqGroupList, setFaqGroupList] = useState([]);
  const [showInstructionModal, setShowInstructionModal] = useState(false);

  const openSliderEdit = () => {
    router.push("/widgets/new");
  };

  const toggleError = useCallback(() => setActiveError(true), [activeError]);

  const errorMarkup = useCallback(() => {
    if (activeError) {
      setTimeout(() => {
        setActiveError(false);
      }, 3000);
      return <Toast duration={2} error={true} content="Server error" />;
    }
  }, [activeError]);

  const getConfig = async () => {
    let data = { shop };

    try {
      authAxios.post(`/api/widget-faq`, data).then(({ data }) => {
        if (data?.success) {
          setSlider(data?.data?.widget);
        }
      });
    } catch (error) {
      toggleError();
    }
  };

  const messageSuccess = useCallback(() => {
    let message;
    switch (activeSuccess) {
      case true:
        message = "Delete success";
        break;
      case 1:
        message = "Copied";
      default:
        break;
    }
    if (activeSuccess || activeSuccess === 1) {
      setTimeout(() => {
        setActiveSuccess(false);
      }, 3000);
      return <Toast duration={2} content={message} />;
    }
  }, [activeSuccess]);

  const handleOpenDelete = useCallback((id) => {
    SetOpenDelete(true);
    setIdSliderDelete(id);
  }, []);

  const handleDeleteSlider = useCallback(async () => {
    let data = { shop };

    try {
      authAxios.delete(`/api/widget-faq/${idSilerDelete}`, data).then(({ data }) => {
        if (data?.success) {
          setActiveSuccess(true);
          const newSlider = slider.filter(
            (item) => item._id !== idSilerDelete
          );
          setSlider(newSlider);
        }
      });
    } catch (error) {
      toggleError();
    }
  }, [slider, idSilerDelete]);

  const getListFaqGroup = useCallback(async () => {
    const datas = {
      shop,
    };
    const respone = await authAxios.post("/api/faq", datas);
    if (respone?.data?.data?.faq?.length > 0) {
      const newFaqGroup = [
        { label: "", value: "" },
        ...respone?.data?.data?.faq?.map((item) => ({
          label: item?.config?.name,
          value: item?._id,
        })),
      ];
      setFaqGroupList(newFaqGroup);
    }
  }, [shop]);

  useEffect(() => {
    getListFaqGroup();
  }, []);

  const handleOpenEdit = (id) => {
    router.push(`/widgets/${id}`);
  };

  const handleCopy = useCallback(() => {
    setActiveSuccess(1);
  }, []);

  useEffect(() => {
    getConfig();
  }, []);

  const renderShortCode = useCallback((id) => {
    return `<div id="simesy-testimonial-${id}" data-view-id="${id}"></div>`;
  }, []);

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
  } = useIndexResourceState(slider);

  const rowMarkup =
    slider?.length > 0 &&
    slider?.map(({ config: { title }, _id, createdAt }, index) => (
      <IndexTable.Row
        id={_id}
        key={_id}
        position={index}
        selected={selectedResources.includes(_id)}
      >
        <IndexTable.Cell>{title}</IndexTable.Cell>
        <IndexTable.Cell>Code</IndexTable.Cell>
        <IndexTable.Cell>
          {moment(createdAt).format("DD/MM/YYYY")}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <ButtonGroup segmented>
            <Button size="slim" onClick={() => handleOpenEdit(_id)}>
              <Icon source={EditMinor} color="base" />
            </Button>
            <Button size="slim" onClick={() => handleOpenDelete(_id)}>
              <Icon title="Delete" source={DeleteMinor} color="base" />
            </Button>
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row>
    ));

  useEffect(() => {
    mixpanel.init(MIXPANEL_TOKEN)
    mixpanel.track("Open Accordions Page", {
      shop
    });
  }, [])

  return (
    <Frame>
      <Page
        title="Accordions"
        primaryAction={{
          content: "Add Accordion",
          onAction: openSliderEdit,
        }}
      >
        <Layout>
          <Layout.Section>
          <Banner
              status="info"
              title="Enable app embed"
            >
              <TextContainer spacing="tight">
                <p>For FAQ accordions to display, the app embed must be activated in your theme settings. Find it in the <strong>Theme settings</strong> section under the <strong>App embeds</strong> tab. Don't forget to PRESS SAVE. <Link onClick={() => setShowInstructionModal(true)}>Check the instructions</Link></p>
                <p>
                  <Button primary external url={`https://${shop}/admin/themes/current/editor?context=apps`}>Enable App Embed</Button>
                </p>
              </TextContainer>
            </Banner>
            <Modal title="How to enable the app embed?" open={showInstructionModal} onClose={() => setShowInstructionModal(false)}>
              <Modal.Section>
                <img style={{width: "100%"}} src="https://cdn.shopify.com/s/files/1/0601/8544/4506/files/Simesy-FAQ-Dev-_-Customize-Updated-copy-of-Dawn-_-Shopify.gif?v=1666151109"></img>
              </Modal.Section>
            </Modal>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <ResourceList
                emptyState={
                  <Card>
                    <div className="faq-empty">
                      <FormLayout>
                        <DisplayText size="small">
                          <TextStyle variation="strong">
                            Create accordion to display FAQs anywhere
                          </TextStyle>
                        </DisplayText>
                        <Button onClick={openSliderEdit} primary>
                          Add Accordion
                        </Button>
                      </FormLayout>
                    </div>
                  </Card>
                }
                resourceName={{ singular: "customer", plural: "customers" }}
                items={slider}
                renderItem={(item) => {
                  const { _id, config } = item;

                  return (
                    <ResourceItem
                      id={_id}
                      accessibilityLabel={`View details for ${_id}`}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <h3
                          style={{
                            width: "70%",
                            overflow: "hidden",
                            wordBreak: "break-word",
                          }}
                        >
                          <TextStyle variation="strong">
                            {config?.title}
                          </TextStyle>
                        </h3>
                        <ButtonGroup>
                          <Button
                            size="slim"
                            onClick={() => handleOpenEdit(_id)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="slim"
                            onClick={() => handleOpenDelete(_id)}
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      </div>
                    </ResourceItem>
                  );
                }}
              />
            </Card>
          </Layout.Section>
          {errorMarkup()}
          {messageSuccess()}
          {openDelete && (
            <ModalConfirmDelete
              setOpen={SetOpenDelete}
              isDeleteWidget={true}
              title="Confirm Delete"
              id={idSilerDelete}
              handleDelete={handleDeleteSlider}
            />
          )}
        </Layout>
      </Page>
    </Frame>
  );
};

export default SliderListing;
