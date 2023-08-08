import {
  Button,
  ButtonGroup,
  Frame,
  Layout,
  Page,
  Toast,
  TopBar,
} from "@shopify/polaris";
import { useFormik } from "formik";
import router from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import { filterObjectValue } from "../constants/function";
import FaqSettingTabLeft from "./FaqSettingTabLeft";
import IframePreview from "./IframePreview";
import mixpanel from "mixpanel-browser";

const FaqSettingEdit = (props) => {
  const { data, isViewOnboard, authAxios } = props;
  const [activeSuccess, setActiveSuccess] = useState(0);
  const [activeError, setActiveError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [faqGroup, setFaqGroup] = useState([]);
  const [localeOptions, setLocaleOptions] = useState([]);
  const [locales, setLocales] = useState([]);
  const [plan, setPlan] = useState("");
  const [transitionsSetting, setTranslationsSetting] = useState("");
  const [faqGroupIframe, setFaqGroupIframe] = useState([]);
  const [errorNameWidget, setErrorNameWidget] = useState("");
  const [idEdit, setIdEdit] = useState("");
  const [isFirstAddSetting, setIsFirstAddSetting] = useState(false);
  const formik = useFormik({
    initialValues: {
      groups: "",
      headerBackgroundColor: "#32a3cb",
      headerHeight: "300",
      showPageTitle: true,
      pageTitle: "Frequently Asked Questions",
      pageTitleSize: "40",

      pageTitleColor: "rgba(255,255,255,1)",
      showPageIntro: true,
      pageIntro:
        "Check most frequently asked questions here, if you still need help then please contact us at <a href='mailto:yellow@hello.com'>yellow@hello.com</a>.",
      pageIntroSize: "18",
      pageIntroColor: "rgba(255,255,255,.9)",
      showSearchBox: true,
      searchPlaceholder: "What can we help you with?",
      searchNotFoundText: "Oops, your search did not match any FAQs",
      groupNameSize: "24",
      groupNameColor: "#000",
      faqStyleID: ["style1"],
      faqBehavior: ["toggle"],
      faqNameTag: ["h3"],
      faqIconPosition: ["right"],
      faqExtras: ["none"],
      faqIconSize: "20",
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
      answerTextColor: '#1E293B',
      theme: "theme0",
      iconColor: "#009DFF",
      linklistStyle: 'style1',
      linklistColor: '#000',
      linklistActiveColor: '#009DFF'
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
    headerBackgroundColor: {
      color: {
        visible: false,
      },
    },
    pageTitleColor: {
      color: {
        visible: false,
      },
    },
    pageIntroColor: {
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
    iconColor: {
      color: {
        visible: false,
      },
    },
    linklistColor: {
      color: {
        visible: false,
      },
    },
    linklistActiveColor: {
      color: {
        visible: false,
      },
    }
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

  const handleSubmit = useCallback(async () => {
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
      translations:
        transitionsSetting && Object.getOwnPropertyNames(transitionsSetting).length > 0
          ? filterObjectValue(transitionsSetting)
          : {},
    };
    setIsLoading(true);
    const datas = {
      shop: data?.shop,
      config,
    };

    if (idEdit) {
      try {
        const { data } = await authAxios.put(
          `/api/faq-setting/${idEdit}`,
          datas
        );
        if (data?.success) {
          setActiveSuccess(2);
        }
      } catch (error) {
        console.log("error1", error);
        toggleError();
      }
      setIsLoading(false);
    } else {
      try {
        const { data } = await authAxios.post(
          `/api/faq-setting/new`,
          datas
        );
        if (data?.success) {
          setIdEdit(data?.data?.faqSetting?._id);
          setActiveSuccess(1);
        }
      } catch (error) {
        console.log("error2", error);
        toggleError();
      }
      setIsLoading(false);
    }

    mixpanel.track("Save FAQ Page Setting", {
      shop: data?.shop,
      groups: formik.values.groups
    })
  }, [idEdit, formik, transitionsSetting]);

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
    setTimeout(() => {
      setActiveSuccess(0);
    }, 2000);
    if (activeSuccess === 1 || activeSuccess === 2 || activeSuccess === 3)
      return <Toast duration={2} content={message} />;
  }, [activeSuccess]);

  const handleBack = () => {
    mixpanel.track("Click Cancel FAQ Page", {
      shop: data?.shop
    })
    router.push("/");
  };

  const getFaqSettingDetail = async (id) => {
    let datas = { shop: data?.shop };

    try {
      authAxios.post(`/api/faq-setting/${id}`, datas).then(({ data }) => {
        if (data?.success) {
          const newValue = Object.assign(
            formik.values,
            data?.data?.faqSetting?.config
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
          setTranslationsSetting(newValue?.translations);
        }
      });
    } catch (error) {
      console.log("error4", error);
      toggleError();
    }
  };

  const handleAddTranslation = useCallback(
    (data) => {
      let newTranslationsSetting = transitionsSetting
        ? { ...transitionsSetting }
        : {};
      data?.translations?.map((item) => {
        newTranslationsSetting = {
          ...newTranslationsSetting,
          [item?.locale]: {
            ...newTranslationsSetting[item?.locale],
            [data?.name]: item?.translate,
          },
        };
      });
      setTranslationsSetting(newTranslationsSetting);
      formik.handleChange({ target: { id: data?.name, value: data?.default } });
    },
    [transitionsSetting, formik]
  );

  const getFaqSettingPage = async () => {
    let datas = { shop: data?.shop };

    try {
      authAxios.post(`/api/faq-setting`, datas).then(({ data }) => {
        if (data?.success && data?.data?.faqSetting[0]?._id) {
          setIdEdit(data?.data?.faqSetting[0]?._id);
          return;
        }
        setIsFirstAddSetting(true);
      });
    } catch (error) {
      console.log("error5", error);
      toggleError();
    }
  };

  useEffect(() => {
    if (idEdit) {
      getFaqSettingDetail(idEdit);
    }
  }, [idEdit]);

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
        icon: item?.config?.icon
      }));
      setFaqGroup(newFaqGroup);
      setFaqGroupIframe(newFaqGroupIframe);
    }
  }, [data?.shop]);

  const getFaqTranslations = async () => {
    let datas = { shop: data?.shop };
    const response = await authAxios.post("/api/faq-translation", datas);
    const translationsData = [];
    response?.data?.data?.map((item) => {
      if (item?.published) {
        translationsData.push({
          label: `${item.name + " (" + item.locale + ")"}${item?.primary ? " - Default" : ""
            }`,
          value: item.locale,
        });
      }
    });
    setLocales(response?.data?.data);
    setLocaleOptions(translationsData);
  };

  const getShopPlan = async () => {
    let datas = { shop: data?.shop };
    const response = await authAxios.post("/api/get_shop_plan", datas);
    setPlan(response?.data?.data?.shop?.plan);
  };

  useEffect(() => {
    getFaqTranslations();
    getShopPlan();
    getFaqSettingPage();
    getListFaqGroup();
  }, []);

  useEffect(() => {
    if(isFirstAddSetting && !idEdit && faqGroup?.length > 0) {
      formik.handleChange({target: {id: 'groups', value: faqGroup?.map(v => v.value)}});
    }
  },[isFirstAddSetting, idEdit, faqGroup])

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
    handleSubmit();
    setErrorNameWidget("");
  }, [idEdit, formik]);

  const viewPage = () => {
    mixpanel.track("Click View Page", {
      shop: data?.shop
    })
    window.open(`https://${data?.shop}/a/faq`, '_blank', 'noopener,noreferrer');
  };

  const userMenuMarkup = useCallback(
    () => (
      <ButtonGroup>
        {!isViewOnboard && <Button plain onClick={handleBack}>
          Cancel
        </Button>}
        <Button loading={isLoading} onClick={beforeSubmit}>
          Save
        </Button>
       {!isViewOnboard && <Button primary onClick={viewPage}>
          View Page
        </Button>}
      </ButtonGroup>
    ),
    [handleBack, isLoading, idEdit]
  );

  const secondaryMenuMarkup = null;

  useEffect(() => {
    mixpanel.init(MIXPANEL_TOKEN)
    mixpanel.track("Open Edit FAQ Page", {
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
            <div className={`${!isViewOnboard && 'editor-wrapper'}`}>
              <div className={`${!isViewOnboard && 'editor-sidebar'}`}>
                <div className={"widget-edit"}>
                  <FaqSettingTabLeft
                    errorNameWidget={errorNameWidget}
                    formik={formik}
                    groups={faqGroup}
                    handleChange={handleChange}
                    handleChangeSetColor={handleChangeSetColor}
                    handleOpenSetColor={handleOpenSetColor}
                    dataBackUp={dataBackUp}
                    colorPagination={colorPagination}
                    shop={data?.shop}
                    plan={plan}
                    locales={locales}
                    localeOptions={localeOptions}
                    transitionsSetting={transitionsSetting}
                    handleAddTranslation={handleAddTranslation}
                  />
                </div>
              </div>
              {!isViewOnboard &&
              <div className="editor-preview">
                <IframePreview
                  shop={data?.shop}
                  formik={formik}
                  faqGroup={faqGroupIframe}
                />
              </div>}
            </div>
            {messageSuccess()}
            {errorMarkup()}
            {/* {isSubmit && <ModalPublishWidget setOpen={setIsSubmit} />} */}
          </Layout>
        </Page>
      </form>
    </Frame>
  );
};

export default FaqSettingEdit;
