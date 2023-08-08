import {
  Button,
  ButtonGroup,
  Frame,
  Heading,
  Layout,
  Page,
  Toast,
  TopBar,
} from "@shopify/polaris";
import { useFormik } from "formik";
import router from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import IframePreview from "./IframePreview";
import ModalPublishWidget from "./ModalPublishWidget";
import WidgetTabLeft from "./WidgetTabLeft";
import mixpanel from "mixpanel-browser"

const SliderEdit = (props) => {
  const { idEdit, setIdEdit, data, isViewOnboard, authAxios } = props;

  const [activeSuccess, setActiveSuccess] = useState(0);
  const [activeError, setActiveError] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenPublish, setIsOpenPublish] = useState(false);
  const [faqGroup, setFaqGroup] = useState([]);
  const [faqGroupIframe, setFaqGroupIframe] = useState([]);
  const [errorNameWidget, setErrorNameWidget] = useState("");
  const formik = useFormik({
    initialValues: {
      title: "",
      faqGroup: "",
      faqStyleID: ["style1"],
      faqBehavior: ["toggle"],
      maxWidth: 900,
      faqNameTag: ["h3"],
      faqIconPosition: ["right"],
      faqExtras: ["none"],
      faqIconSize: 20,
      faqIconSelect: ["1"],
      faqQuestionCloseColor: "#333",
      faqQuestionOpenColor: "#11a9d5",
      faqIconCloseColor: "#11a9d5",
      faqIconOpenColor: "#11a9d5",
      customCss: "",
      groupNameFontSize: 20,
      groupNameFontWeight: "bold",
      groupNameTextStyle: "capitalize",
      groupNameTextAlign: "left",
      groupNameColor: "#333333",
      questionFontSize: 15,
      questionFontWeight: "bold",
      questionTextColor: "#1E293B",
      questionBgColor: '#F3F4F6',
      questionHoverColor: "#E5E7EB",
      answerFontSize: 15,
      answerFontWeight: 'normal',
      answerBgColor: '#F9FAFB',
      answerTextColor: '#1E293B'
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
    // validationSchema: validationSchema,
  });

  const [colorPagination, setColorPagination] = useState({
    faqQuestionCloseColor: {
      color: {
        visible: false,
      },
    },
    faqQuestionOpenColor: {
      color: {
        visible: false,
      },
    },
    faqIconCloseColor: {
      color: {
        visible: false,
      },
    },
    faqIconOpenColor: {
      color: {
        visible: false,
      },
    },
    groupNameColor: {
      color: {
        visible: false,
      },
    },
    questionBgColor: {
      color: {
        visible: false,
      },
    },
    questionTextColor: {
      color: {
        visible: false,
      },
    },
    questionHoverColor: {
      color: {
        visible: false,
      },
    },
    answerTextColor: {
      color: {
        visible: false,
      },
    },
    answerBgColor: {
      color: {
        visible: false,
      },
    },
  });

  const [dataBackUp, setDataBackUp] = useState(formik.initialValues);

  const validationSchema = yup.object({
    faqName: yup.string().required("Name can't be blank."),
  });

  const handleChange = (value, id) => {
    formik.handleChange({ target: { id, value } });
  };

  useEffect(() => {
    if (!isViewOnboard) {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isViewOnboard]);

  const handleSubmit = async () => {
    const {
      faqBehavior,
      faqNameTag,
      faqIconPosition,
      faqExtras,
      faqIconSelect,
      faqStyleID,
    } = formik.values;
    const config = {
      ...formik.values,
      faqStyleID: faqStyleID[0],
      faqBehavior: faqBehavior[0],
      faqNameTag: faqNameTag[0],
      faqIconPosition: faqIconPosition[0],
      faqExtras: faqExtras[0],
      faqIconSelect: faqIconSelect[0],
    };
    const datas = {
      shop: data?.shop,
      config,
    };
    setIsSubmit(true);
    mixpanel.track("Save Accordion Setting", {
      shop: data?.shop,
      groups: formik.values.faqGroup
    });
    if (idEdit) {
      try {
        const { data } = await authAxios.put(
          `/api/widget-faq/${idEdit}`,
          datas
        );
        if (data?.success) {
          setActiveSuccess(2);
        }
      } catch (error) {
        toggleError();
      }
      return;
    }
    try {
      const { data } = await authAxios.post(`/api/widget-faq/new`, datas);
      if (data?.success) {
        setIdEdit(data?.data?.widget?._id);
        setActiveSuccess(1);
      }
    } catch (error) {
      toggleError();
    }
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

  const messageSuccess = useCallback(() => {
    let message = "";
    if (activeSuccess === 1) {
      message = "Add New Success";
    }
    if (activeSuccess === 2) {
      message = "Edit Success";
    }
    if (activeSuccess === 3) {
      message = "Install Success";
    }
    setTimeout(() => {
      setActiveSuccess(0);
    }, 2000);
    if (activeSuccess === 1 || activeSuccess === 2 || activeSuccess === 3)
      return <Toast duration={2} content={message} />;
  }, [activeSuccess]);

  const handleBack = () => {
    router.push("/widgets");
  };

  const getWidgetDetail = async (id) => {
    let data = { shop: data?.shop };

    try {
      authAxios.post(`/api/widget-faq/${id}`, data).then(({ data }) => {
        if (data?.success) {
          const newValue = Object.assign(
            formik.values,
            data?.data?.widget?.config
          );
          formik.setValues({
            ...newValue,
            faqStyleID: [newValue?.faqStyleID],
            faqBehavior: [newValue?.faqBehavior],
            faqNameTag: [newValue?.faqNameTag],
            faqIconPosition: [newValue?.faqIconPosition],
            faqExtras: [newValue?.faqExtras],
            faqIconSelect: [newValue?.faqIconSelect],
          });
          setDataBackUp(newValue);
        }
      });
    } catch (error) {
      toggleError();
    }
  };

  useEffect(() => {
    if (idEdit) {
      getWidgetDetail(idEdit);
    }
  }, [idEdit]);

  useEffect(() => {
    if (router?.query?.id && typeof window !== "undefined") {
      setIdEdit(router.query.id);
      // getSlider(id);
    }
  }, [router]);

  const getListFaqGroup = useCallback(async () => {
    const datas = {
      shop: data?.shop,
    };
    const respone = await authAxios.post("/api/faq", datas);
    if (respone?.data?.data?.faq?.length > 0) {
      const newFaqGroup = respone?.data?.data?.faq?.map((item) => ({
        label: item?.config?.name,
        value: item?._id,
      }));
      const newFaqGroupIframe = respone?.data?.data?.faq?.map((item) => ({
        id: item?._id,
        name: item?.config?.name,
        faqs: item?.config?.faqs,
      }));

      setFaqGroup(newFaqGroup);
      setFaqGroupIframe(newFaqGroupIframe);
    }
  }, [data?.shop]);

  useEffect(() => {
    getListFaqGroup();
  }, []);

  const handleChangeSetColor = (key) => (value) => {
    const colorRgba = `rgba(${value.rgb.r}, ${value.rgb.g}, ${value.rgb.b}, ${value.rgb.a})`;
    setDataBackUp({ ...dataBackUp, [key]: colorRgba });
    formik.handleChange({ target: { id: key, value: colorRgba } });
  };

  const handleOpenSetColor = (key, keyChild) => {
    if (keyChild) {
      setColorPagination({
        ...colorPagination,
        [key]: {
          ...colorPagination[key],
          [keyChild]: {
            ...colorPagination[key][keyChild],
            visible: !colorPagination[key][keyChild]?.visible,
          },
        },
      });
    } else {
      setColorPagination({
        ...colorPagination,
        [key]: {
          ...colorPagination[key],
          visible: !colorPagination[key].visible,
        },
      });
    }
  };

  const beforeSubmit = useCallback(() => {
    if (formik.values.title) {
      handleSubmit();
      setErrorNameWidget("");
      return;
    }
    setErrorNameWidget("Title can't be blank.");
  }, [formik]);

  const userMenuMarkup = useCallback(
    () => (
      <ButtonGroup>
        {!isViewOnboard &&
          <Button plain={true} onClick={handleBack}>
            Cancel
          </Button>}
        <Button loading={isLoading} onClick={beforeSubmit}>
          Save
        </Button>
        {idEdit && !isViewOnboard && (
          <Button onClick={() => {setIsOpenPublish(true); mixpanel.track("Click Install Accordion", {shop: data?.shop})}} primary>
            Install
          </Button>
        )}
      </ButtonGroup>
    ),
    [handleBack, isLoading, idEdit]
  );

  const secondaryMenuMarkup = <Heading>{formik.values.title}</Heading>;

  useEffect(() => {
    mixpanel.init(MIXPANEL_TOKEN)
    mixpanel.track("Open Accordions Edit Page", {
      shop: data?.shop
    });
  }, [])

  return (
    <Frame>
      <form className="edit-widget">
        <Page fullWidth>
          <Layout>

            <Layout.Section fullWidth>
              <div className="top-bar">
                <TopBar
                  userMenu={userMenuMarkup()}
                  searchField={secondaryMenuMarkup}
                />
              </div>
            </Layout.Section>
            <div className={`${!isViewOnboard && "editor-wrapper"}`}>
              <div className={`${!isViewOnboard && 'editor-sidebar'}`}>
                <div className={"widget-edit"}>
                  <WidgetTabLeft
                    errorNameWidget={errorNameWidget}
                    formik={formik}
                    faqGroup={faqGroup}
                    handleChange={handleChange}
                    handleChangeSetColor={handleChangeSetColor}
                    handleOpenSetColor={handleOpenSetColor}
                    dataBackUp={dataBackUp}
                    plan={data?.plan}
                    colorPagination={colorPagination}
                  />
                </div>
              </div>
              {!isViewOnboard &&
                <div className="editor-preview">
                  <IframePreview
                    shop={data?.shop}
                    formik={formik}
                    isFaq={true}
                    faqGroup={faqGroupIframe}
                  />
                </div>}
            </div>
          </Layout>
          {messageSuccess()}
          {errorMarkup()}
          {isOpenPublish && (
            <ModalPublishWidget widgetId={idEdit} setOpen={setIsOpenPublish} />
          )}
        </Page>
      </form>
    </Frame>
  );
};

export default SliderEdit;
