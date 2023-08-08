import React, { useEffect, useCallback, useState } from "react";
import {
  Toast,
  Page,
  Layout,
  Card,
  Button,
  Frame,
  ButtonGroup,
  IndexTable,
  useIndexResourceState,
  Icon,
} from "@shopify/polaris";
import axios from "axios";
import { DeleteMinor, EditMinor } from "@shopify/polaris-icons";

import ModalConfirmDelete from "./ModalConfirmDelete";
import moment from "moment";
import router from "next/router";
import RequestCustom from "../constants/request";

const heading = [
  { title: "Title" },
//   { title: "Shortcode" },
  { title: "Date" },
  { title: "" },
];

const resourceName = {
  singular: "customer",
  plural: "customers",
};

const FaqListing = (props) => {
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

  const openSliderEdit = () => {
    router.push("/faq-page-settings/new");
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
      authAxios.post(`/api/faq-setting`, data).then(({ data }) => {
        if (data?.success) {
          setSlider(data?.data?.faqSetting);
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

  const handleDeleteSlider = useCallback(
    async () => {
      let data = { shop };
      try {
        authAxios.delete(`/api/faq-setting/${idSilerDelete}`, data).then(({ data }) => {
          if (data?.success) {
            setActiveSuccess(true);
            const newSlider = slider.filter((item) => item._id !== idSilerDelete);
            setSlider(newSlider);
          }
        });
      } catch (error) {
        toggleError();
      }
    },
    [slider, idSilerDelete]
  );

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
    router.push(`/faq-page-settings/${id}`);
  };

  useEffect(() => {
    getConfig();
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

  return (
    <Frame>
      <Page
        title="Faq Settings"
        primaryAction={{
          content: "Add Setting",
          onAction: openSliderEdit,
        }}
      >
        <Layout>
          <Layout.Section>
            <Card>
              {slider?.length > 0 && (
                <>
                  <IndexTable
                    resourceName={resourceName}
                    headings={heading}
                    itemCount={slider?.length}
                    selectable={false}
                    selectedItemsCount={
                      allResourcesSelected ? "All" : selectedResources.length
                    }
                    onSelectionChange={handleSelectionChange}
                  >
                    {rowMarkup}
                  </IndexTable>
                </>
              )}
            </Card>
          </Layout.Section>
          {errorMarkup()}
          {messageSuccess()}
          {openDelete && (
            <ModalConfirmDelete
              setOpen={SetOpenDelete}
              title="Remove Setting"
              id={idSilerDelete}
              handleDelete={handleDeleteSlider}
            />
          )}
        </Layout>
      </Page>
    </Frame>
  );
};

export default FaqListing;
