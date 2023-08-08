import {
  Button,
  Card,
  FormLayout,
  Layout,
  Page,
  DisplayText,
  Toast,
  Frame,
  Banner,
  TextContainer,
  Link,
} from "@shopify/polaris";
import { arrayMoveImmutable as arrayMove } from "array-move";
import { useFormik } from "formik";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import FaqGroup from "../components/FaqGroup";
import ModalAddFaq from "../components/ModalAddFaq";
import ModalAddFaqGroup from "../components/ModalAddFaqGroup";
import ModalGettingStarted from "./ModalGettingStarted";

const UUID = "7bc492c0-ee66-46b8-a3b9-f0e832688730"

function FaqComponent({ authAxios, shop }) {
  const [idEditAddNew, setIdEditAddNew] = useState("");
  const [idEditFaqGroup, setIdEditFaqGroup] = useState("");
  const [faqItem, setFaqItem] = useState("");
  const [groupId, setGroupId] = useState("");
  const [faqId, setFaqId] = useState("");
  const [shopName, setShopName] = useState("");
  const [plan, setPlan] = useState("");
  const [groupData, setGroupData] = useState("");
  const [localeOptions, setLocaleOptions] = useState([]);
  const [locales, setLocales] = useState([]);
  const [faqData, setFaqData] = useState("");
  const [mainThemeID, setMainThemeID] = useState("");
  const [activeSuccess, setActiveSuccess] = useState(0);
  const [activeError, setActiveError] = useState(false);
  const [enableApp, setEnableApp] = useState(null);
  const [isOpenModalAddGroup, setIsOpenModalAddGroup] = useState(false);
  const [isOpenModalAddFaq, setIsOpenModalAddFaq] = useState(false);
  const [isReachLimit, setIsReachLimit] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  const formik = useFormik({
    initialValues: {
      groups: [],
    },
  });

  useEffect(() => {
    getFaqGroup();
  }, []);

  const handleOpenAddGroup = useCallback(async () => {
    setIsOpenModalAddGroup(true);
  }, [formik]);

  const handleOpenEditGroup = useCallback(
    async (data) => {
      setIsOpenModalAddGroup(true);
      setGroupData(data);
    },
    [formik, setGroupData]
  );

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
      message = "Saved";
    }
    if (activeSuccess === 2) {
      message = "Edit Success";
    }
    setTimeout(() => {
      setActiveSuccess(0);
    }, 2000);
    if (activeSuccess !== 0 && message)
      return <Toast duration={2} content={message} />;
  }, [activeSuccess]);

  const handleAddGroupFaq = async (groupData) => {
    const datas = {
      shop,
      config: {
        name: groupData?.groupName,
        checked: false,
        faqs: [],
        description: groupData?.description,
        icon: groupData?.icon ? groupData?.icon : '',
        translations: groupData?.translationsUpdate,
      },
    };
    try {
      const { data } = await authAxios.post("/api/faq-group/new", datas);
      const newData = {
        id: data?.data?.faq?._id,
        ...data.data?.faq?.config,
      };
      formik.values.groups?.push(newData);
      setIsOpenModalAddGroup(false);
      setActiveSuccess(1);
    } catch (error) {
      toggleError();
    }
  };

  const getLocalesTranslation = async () => {
    const datas = {
      shop,
    };
    const { data } = await authAxios.post("/api/faq-translation", datas);
    const translationsData = [];
    data?.data?.map((item) => {
      if (item?.published) {
        translationsData.push({
          label: `${item.name + " (" + item.locale + ")"}${
            item?.primary ? " - Default" : ""
          }`,
          value: item.locale,
        });
      }
    });
    setLocales(data?.data);
    setLocaleOptions(translationsData);
  };

  const findPropertiesWithMatchingType = (data) => {
    if (!data) {
      return false;
    }
    const embedBlock = Object.entries(data).find(([id, info]) => {
      return info.type.endsWith(UUID) && !info.disabled
    })
    return !!embedBlock
  }

  const checkEnableApp = async () => {
    try {
      // Read the value of the 'shop' cookie
      const shop = localStorage.getItem("shop");
      setShopName(shop.replace(/\.myshopify\.com$/, ''));
      const {data} = await authAxios.post(
        `/api/shopify_theme_list`,
        {
          "shop": shop
        }
      );
      const themeID = data.data.find((item) => item.role === "main").id;
      setMainThemeID(themeID);
      const res = await authAxios.post(
        `/api/shopify_asset`,
        {
          "shop": shop,
          "themeId": themeID,
          "assetKey": "config/settings_data.json"
        }
      );
      const value = JSON.parse(res.data.data.value);

      setEnableApp(findPropertiesWithMatchingType(value.current.blocks));

      console.log(enableApp);
    } catch (error) {
      console.log(error);
      toggleError();
    }
  }

  useEffect(() => {
    checkEnableApp();
    getLocalesTranslation();
    getShopPlan();
  }, []);

  const handleEditGroup = useCallback(
    async (group) => {
      const groupFaq = formik?.values?.groups?.find(
        (item) => item?.id === groupData?.id
      );
      const dataRequest = {
        shop,
        config: {
          name: group?.groupName,
          description: group?.description,
          checked:
            groupData?.checked !== undefined
              ? groupData?.checked
              : groupFaq?.checked,
          faqs: groupData?.faqs,
          icon: group?.icon ? group?.icon: "",
          translations: group?.translationsUpdate,
        },
        nameOld: groupFaq?.name,
      };

      try {
        const { data } = await authAxios.put(
          `/api/faq-group/${groupData?.id}`,
          dataRequest
        );

        if (data) {
          const newGroups = formik.values.groups?.map((item) => {
            if (item?.id === groupData?.id) {
              return { ...item, ...dataRequest["config"] };
            }
            return { ...item };
          });
          formik.handleReset();
          formik.setFieldValue("groups", newGroups);
        }
        setIdEditAddNew("");
        setGroupData("");
        setIsOpenModalAddGroup(false);
        setActiveSuccess(1);
      } catch (error) {
        toggleError();
      }
    },
    [formik, groupData]
  );

  const getFaqGroup = async () => {
    const datas = {
      shop,
    };
    const { data } = await authAxios.post("/api/faq", datas);
    if (data?.data?.faq?.length > 0) {
      const newFaqGroup = data?.data?.faq?.map((item) => ({
        ...item?.config,
        id: item?._id,
      }));
      formik.setValues({ groups: newFaqGroup });
    } else {
      setIsFirstTime(true);
    }
  };

  const getShopPlan = async () => {
    let bodyRequest = {
      shop,
    };
    const { data } = await authAxios.post("/api/get_shop_plan", bodyRequest);
    setPlan(data?.data?.shop?.plan);
  };

  const handleOpenAddFaq = (id) => {
    setIsOpenModalAddFaq(true);
    setGroupId(id);
  };

  const handleOpenEditFaq = async (data, groupID) => {
    setFaqData(data);
    setGroupId(groupID);
    setIsOpenModalAddFaq(true);
  };

  const handleAddFaq = useCallback(
    async (faqData) => {
      setIsOpenModalAddFaq(false);
      const newGroup = formik.values.groups?.find(
        (item) => item?.id === groupId
      );
      const idRandom = Math.random().toString(36).slice(2);

      const newValue = formik.values.groups?.map((item) => {
        if (item?.id === groupId) {
          return {
            ...item,
            faqs: [
              ...item.faqs,
              ...[
                {
                  id: idRandom,
                  question: faqData?.question,
                  answer: faqData?.answer,
                  checked: false,
                  translations: faqData?.translationsUpdate,
                },
              ],
            ],
          };
        }
        return { ...item };
      });
      const datas = {
        id: groupId,
        config: {
          ...newGroup,
          faqs: [
            ...newGroup.faqs,
            ...[
              {
                id: idRandom,
                question: faqData?.question,
                answer: faqData?.answer,
                checked: false,
                translations: faqData?.translationsUpdate,
              },
            ],
          ],
        },
      };
      try {
        const { data } = await authAxios.put(`/api/faq/new`, datas);
        if (data) {
          if (formik.values.groups.length === 1 && data?.data?.faq?.config?.faqs?.length === 1) {
            setIsOpenModalSuccess(true);
          }
          formik.handleChange({ target: { id: "groups", value: newValue } });
          setIdEditFaqGroup(data?.data?.faq?._id);
          setFaqItem(idRandom);
          setActiveSuccess(1);
        }
      } catch (error) {
        console.log(error);
        toggleError();
      }
    },
    [formik, groupId]
  );

  const handleEditFaq = useCallback(
    async (faq) => {
      const newGroup = formik?.values?.groups?.find(
        (item) => item?.id === groupId
      );
      const newFaq = newGroup?.faqs?.map((item) => {
        if (item?.id === faqData?.id) {
          console.log(item);
          console.log(faqData);
          if (!faqData.hasOwnProperty("translations")) {
            faqData.translations = [];
          }
          return {
            ...item,
            answer: faq?.answer,
            question: faq?.question,
            checked: item?.checked !== null ? !item?.checked : item?.checked,
            translations: [...faqData.translations, ...faq?.translationsUpdate],
          };
        }
        return { ...item };
      });
      const newValue = formik?.values?.groups?.map((item) => {
        if (item?.id === groupId) {
          return { ...item, faqs: newFaq };
        }
        return { ...item };
      });
      const dataRequest = {
        id: groupId,
        config: { ...newGroup, faqs: newFaq },
      };

      try {
        const { data } = await authAxios.put(`/api/faq/new`, dataRequest);
        if (data) {
          formik.handleReset();
          formik.handleChange({ target: { id: "groups", value: newValue } });
        }
        setFaqItem("");
        setFaqData("");
        setIsOpenModalAddFaq(false);
        setGroupId("");
        setActiveSuccess(1);
      } catch (error) {
        toggleError();
      }
    },
    [formik, faqData, groupId]
  );

  const deleteFaq = useCallback(
    async ({ groupId, faqId }) => {
      const newGroup = formik?.values?.groups?.find(
        (item) => item?.id === groupId
      );
      const newFaq = newGroup?.faqs?.filter((item) => item?.id !== faqId);
      const newValue = formik?.values?.groups?.map((item) => {
        if (item?.id === groupId) {
          return { ...item, faqs: newFaq };
        }
        return { ...item };
      });
      const datas = {
        id: groupId,
        config: { ...newGroup, faqs: newFaq },
      };
      const { data } = await authAxios.put(`/api/faq/new`, datas);
      if (data) {
        formik.handleReset();
        formik.handleChange({ target: { id: "groups", value: newValue } });
      }
      return true;
    },
    [formik]
  );

  const handleUpRow = async ({ groupId, faqId }) => {
    const newGroup = _.find(formik.values.groups, { id: groupId });
    const { faqs } = newGroup;
    const indexItem = _.findIndex(faqs, { id: faqId });
    if (faqs[indexItem - 1] && faqs[indexItem]) {
      let newFaq = arrayMove(faqs, indexItem, indexItem - 1);
      const newValue = formik?.values?.groups?.map((item) => {
        if (item?.id === groupId) {
          return { ...item, faqs: newFaq };
        }
        return { ...item };
      });
      const datas = {
        id: groupId,
        config: { ...newGroup, faqs: newFaq },
      };
      const { data } = await authAxios.put(`/api/faq/new`, datas);
      if (data) {
        formik.handleReset();
        formik.handleChange({ target: { id: "groups", value: newValue } });
      }
    }
  };

  const handleDownRow = async ({ groupId, faqId }) => {
    const newGroup = _.find(formik.values.groups, { id: groupId });
    const { faqs } = newGroup;
    const indexItem = _.findIndex(faqs, { id: faqId });
    if (faqs[indexItem + 1] && faqs[indexItem]) {
      let newFaq = arrayMove(faqs, indexItem, indexItem + 1);
      const newValue = formik?.values?.groups?.map((item) => {
        if (item?.id === groupId) {
          return { ...item, faqs: newFaq };
        }
        return { ...item };
      });
      const datas = {
        id: groupId,
        config: { ...newGroup, faqs: newFaq },
      };
      const { data } = await authAxios.put(`/api/faq/new`, datas);
      if (data) {
        formik.handleReset();
        formik.handleChange({ target: { id: "groups", value: newValue } });
      }
    }
  };

  const deleteGroup = useCallback(
    async (id, group) => {
      const { data } = await authAxios.delete(`api/faq-group/${id}`);
      if (data?.success) {
        const newGroup = group.filter((item) => item?.id !== id);
        formik.handleChange({ target: { id: "groups", value: newGroup } });
      }
      setIdEditAddNew("");
    },
    [shop, formik]
  );

  const renderGroup = useCallback(
    (item) => {
      return (
        <FaqGroup
          isReachLimit={isReachLimit}
          handleOpenAddFaq={handleOpenAddFaq}
          handleEditGroup={handleEditGroup}
          deleteGroup={deleteGroup}
          idEditAddNew={idEditAddNew}
          key={item?.id}
          group={item}
          formik={formik}
          idEditFaqGroup={idEditFaqGroup}
          faqItem={faqItem}
          editFaq={handleEditFaq}
          deleteFaq={deleteFaq}
          handleUpRow={handleUpRow}
          handleDownRow={handleDownRow}
          handleOpenEditFaq={handleOpenEditFaq}
          handleOpenEditGroup={handleOpenEditGroup}
        />
      );
    },
    [
      formik,
      handleEditFaq,
      faqItem,
      idEditFaqGroup,
      idEditAddNew,
      deleteGroup,
      handleEditGroup,
      handleOpenAddFaq,
      deleteFaq,
      handleUpRow,
      handleDownRow,
    ]
  );

  const checkLimit = () => {
    let excludes = [
      "simesy-faq.myshopify.com",
      "sell-ebook-app-demo.myshopify.com",
      "cambridgetestshop.myshopify.com",
      "funlights00.myshopify.com",
      "easy-rose-skin.myshopify.com",
      "instant-ar-wa-hair.myshopify.com",
      "honstein.myshopify.com",
      "tollovid.myshopify.com",
      "trial-store-12345678919.myshopify.com",
      "estro-frari.myshopify.com",
      "new-liquidnano.myshopify.com",
      "harjinder178.myshopify.com",
      "prevensbyporall.myshopify.com",
      "alisasokur.myshopify.com",
      "street-supply-clothing-co.myshopify.com",
      "jransomla.myshopify.com",
      "shankid.myshopify.com",
      "lespervenches.myshopify.com",
      "dyloux-beauty.myshopify.com",
      "thejourneymanalchemist.myshopify.com",
      "wyvernsvault.myshopify.com",
      "bomboloniboss.myshopify.com",
      "gyrosoff.myshopify.com",
      "acquamatic.myshopify.com",
      "ez-cell-usa.myshopify.com",
      "glitterglas.myshopify.com",
      "chichic1.myshopify.com",
      "zodinbike.myshopify.com",
      "ael-supplies.myshopify.com",
      "margaca.myshopify.com",
      "mansbestbuddy.myshopify.com",
      "nada-ab.myshopify.com",
      "cozifeet11.myshopify.com",
      "valuephonesuk.myshopify.com",
      "qlup-of-kings.myshopify.com",
      "my-app-test-store-jle.myshopify.com",
      "bespoke-co-candles.myshopify.com",
      "nbfurnishers.myshopify.com",
      "hellogolf-b2c.myshopify.com",
      "hello-1848.myshopify.com",
      "dnafreedomwalkerflorida-com.myshopify.com",
      "projeskin-cosmetic.myshopify.com",
      "vylome.myshopify.com",
      "ofrida-new.myshopify.com",
      "firstegen.myshopify.com",
      "ramsescbd.myshopify.com",
      "hachiwithlove.myshopify.com",
      "setamono.myshopify.com",
      "yatoys-venezuela-c-a.myshopify.com",
      "falcon-mobility-singapore.myshopify.com",
      "symphonia-0d3d.myshopify.com",
      "ashley-614.myshopify.com",
      "comfeezone.myshopify.com",
      "aroma-bath-and-body.myshopify.com",
      "pastrylove-by-sheila-j.myshopify.com",
      "teststore1472.myshopify.com",
      "woof-magic-wm.myshopify.com",
      "eco-land-pte-ltd.myshopify.com",
      "dunia-shoes-uae.myshopify.com",
      "ginger-milk-natural-care-europa.myshopify.com",
      "vewheels.myshopify.com",
      "the-brand-persona.myshopify.com",
      "maxguardx.myshopify.com",
      "design-hut-australia.myshopify.com",
      "beautybar-mtl.myshopify.com",
      "lazy-hippos.myshopify.com",
      "qrest-shop.myshopify.com",
      "bronzemeco.myshopify.com",
      "dippy-cow-nails.myshopify.com",
      "pixlip-reseller.myshopify.com",
      "kartedesignfabrik.myshopify.com",
      "sunstopus.myshopify.com",
      "masteringramen.myshopify.com",
      "browserieshop.myshopify.com",
      "baristo-beans.myshopify.com",
      "pet-wipes-uk.myshopify.com",
      "worldtier.myshopify.com",
      "bookzoo-in.myshopify.com",
      "www-pucstore-nl.myshopify.com",
      "betaag1.myshopify.com",
      "urban-littles-inc.myshopify.com",
      "thetrendingselection.myshopify.com",
      "jewelryyoli.myshopify.com",
      "brandsales-db55.myshopify.com",
      "nordic-smell.myshopify.com",
      "hi-phonestore.myshopify.com",
      "davidjonkaitis.myshopify.com",
      "smartazminerals.myshopify.com",
      "lea-dziggel.myshopify.com",
      "normalize-bougie.myshopify.com",
      "zebaqi-official.myshopify.com",
      "azadktm422.myshopify.com",
      "trilogene.myshopify.com",
      "cdlmicro.myshopify.com",
      "hellob-pod.myshopify.com",
      "aritesgymgear.myshopify.com",
      "fidelity-cams.myshopify.com",
      "lash-boss-melbourne.myshopify.com",
      "watergeneratorcom.myshopify.com",
      "oh-my-fantasy.myshopify.com",
      "showershowz.myshopify.com",
      "stoker-family-garden.myshopify.com",
      "spielo.myshopify.com",
      "thebrightbeaver.myshopify.com",
      "mcocod.myshopify.com",
      "major-vapour.myshopify.com",
      "thetranquilstoreco.myshopify.com",
      "uvpocketstore.myshopify.com",
      "touchmaic-com.myshopify.com",
      "power-l.myshopify.com",
      "zovvo1.myshopify.com",
      "nutlet-co.myshopify.com",
      "dermayus.myshopify.com",
      "royalcarpet416.myshopify.com",
      "taratpics-shop.myshopify.com",
      "cbd-vapes-australia.myshopify.com",
      "aloe-jewelry.myshopify.com",
      "omgteesus.myshopify.com",
      "design-line-co.myshopify.com",
      "lyfemotion.myshopify.com",
      "rdddd222.myshopify.com",
      "queencampuzano101-a633.myshopify.com",
      "dezirenatural.myshopify.com",
      "mon-filet-de-camouflage.myshopify.com",
      "springberryfresh-new.myshopify.com",
      "psychegear.myshopify.com",
      "edutoyco.myshopify.com",
      "fs-snakes.myshopify.com",
      "housefinesestore.myshopify.com",
      "cosac-beanbags.myshopify.com",
      "primasieraden.myshopify.com",
      "larry-carlson.myshopify.com",
      "luxurious-blink-llc.myshopify.com",
      "silvayug-test.myshopify.com",
      "incresoshop.myshopify.com",
      "fasiean.myshopify.com",
      "my-favorite-mugs.myshopify.com",
      "bird-on-a-moon.myshopify.com",
      "ejaystylezcollectionz.myshopify.com",
      "aysmal.myshopify.com",
      "supa-cent.myshopify.com",
      "itmyb.myshopify.com",
      "blackentrepreneurcollection.myshopify.com",
      "arditicollection.myshopify.com",
      "centurybottles.myshopify.com",
      "doriana-cosmetics-ug.myshopify.com",
      "mondo143.myshopify.com",
      "scratchittt.myshopify.com",
      "thegarrison-de.myshopify.com",
      "fitnessonar.myshopify.com",
      "dtecc.myshopify.com",
      "cil-creations.myshopify.com",
      "thegarrison-fr.myshopify.com",
      "licence-keys-soft.myshopify.com",
      "cheekygood-nz.myshopify.com",
      "enceoshop.myshopify.com",
      "homefinese.myshopify.com",
      "eir-wellness.myshopify.com",
      "freenyshop.myshopify.com",
      "goldcatmusic.myshopify.com",
      "hyla-malaysia.myshopify.com",
      "gn974shop.myshopify.com",
      "gin-by-you.myshopify.com",
      "little-japan-ea21.myshopify.com",
      "juliacowell.myshopify.com",
      "chucktown-wax-wick.myshopify.com",
      "glamourz-boutique.myshopify.com",
      "selfieque.myshopify.com",
      "iamroofa.myshopify.com",
      "awebs-test.myshopify.com",
      "saintjane.myshopify.com",
      "hyggecave.myshopify.com",
      "contact-1803.myshopify.com",
      "alan168.myshopify.com",
      "hp2021.myshopify.com",
      "chun0323.myshopify.com",
      "donghwa.myshopify.com",
      "algwhrr.myshopify.com",
      "ridesons.myshopify.com",
      "jerehgroup.myshopify.com",
      "q965874.myshopify.com",
      "bloomingresale.myshopify.com",
      "tontik.myshopify.com",
      "rezivot.myshopify.com",
      "shopkiaf.myshopify.com",
      "gymtwister.myshopify.com",
      "cololight-0618.myshopify.com",
      "aa08007.myshopify.com",
      "ezwant77.myshopify.com",
      "chloechewjiaying.myshopify.com",
      "sodiem.myshopify.com",
      "info-69a5.myshopify.com",
      "onlylovefrance.myshopify.com",
      "jucer-ev.myshopify.com",
      "65lifebelle.myshopify.com",
      "magnamaya.myshopify.com",
      "tapmo-india.myshopify.com",
      "deiresherriebeauty.myshopify.com",
      "lebanz-shop.myshopify.com",
      "aguilar-m.myshopify.com",
      "lovelypets-fun.myshopify.com",
      "therocketyyc.myshopify.com",
      "the-breastfeeding-tea-co.myshopify.com",
      "zaarwish.myshopify.com",
      "lovebrushshop.myshopify.com",
      "maliahairaus.myshopify.com",
      "lynnsc-cc.myshopify.com",
      "mystormcase.myshopify.com",
      "sorrento-pegasus.myshopify.com",
      "invernoscent.myshopify.com",
      "winsdeal.myshopify.com",
      "arrosto-coffee-roastery.myshopify.com",
      "meetworldshop.myshopify.com",
      "safe-girls-ita.myshopify.com",
      "mangrove-bay-clothing.myshopify.com",
      "nxtensions.myshopify.com",
      "slushy-cup-adf7.myshopify.com",
      "buyinghouseinturkey.myshopify.com",
      "clothingbrandwithbigdreams.myshopify.com",
      "huexc.myshopify.com",
      "heritageofficialfsd.myshopify.com",
      "cotantin.myshopify.com",
      "shopwinnieandco.myshopify.com",
      "wild-rymba-my.myshopify.com",
      "gummieswithatwist-1101.myshopify.com",
      "aventestore.myshopify.com",
      "blendiejuice.myshopify.com",
      "vipdnsclub.myshopify.com",
      "silk-choice.myshopify.com",
      "tarot-goddesses.myshopify.com",
      "babydi1218.myshopify.com",
      "asia-nugnes.myshopify.com",
      "eu-nugnes.myshopify.com",
      "jardisponsable.myshopify.com",
      "universal-shop-au.myshopify.com",
      "ledlightining.myshopify.com",
      "solosecure.myshopify.com",
      "sahajbymalvika.myshopify.com",
      "treelove-com.myshopify.com",
      "nugnes.myshopify.com",
      "ivory-swiss-premium.myshopify.com",
      "uk-nugnes.myshopify.com",
      "us-nugnes.myshopify.com",
      "world-nugnes.myshopify.com",
      "mcslippers0.myshopify.com",
      "blend-it-bottle-2.myshopify.com",
      "merryminer.myshopify.com",
      "duniashoesme.myshopify.com",
      "ateliertrigere.myshopify.com",
      "lkkbeauty.myshopify.com",
      "woodenmemoriesinc.myshopify.com",
      "ping7111.myshopify.com",
      "brutus-llc.myshopify.com",
      "esfoliaglam.myshopify.com",
      "basykabox.myshopify.com",
      "americanpatrioticclub.myshopify.com",
      "mistery-co.myshopify.com",
      "the-petshop-boyz.myshopify.com",
      "sawdustandsandwoodworks.myshopify.com",
      "basevin.myshopify.com",
      "zaychrisbasketball.myshopify.com",
      "00fa28.myshopify.com",
      "myweighingspoon.myshopify.com",
      "faucable.myshopify.com",
      "hello-509d.myshopify.com",
      "51f100.myshopify.com",
      "at-ele.myshopify.com",
      "house-of-bougainvillea-com.myshopify.com",
      "makocreations.myshopify.com",
      "glamyo-dental.myshopify.com",
      "mdrn-mood.myshopify.com",
      "perfectdiary-beauty.myshopify.com",
      "pure-theme-simesy.myshopify.com",
      "chienvu-store.myshopify.com",
      "taylow-ltd.myshopify.com",
      "lsupports-1060.myshopify.com",
      "allsmilesappare.myshopify.com",
      "zuanco.myshopify.com",
      "thine-golf.myshopify.com",
      "24hourdealseu.myshopify.com",
      "imminent-corporation.myshopify.com",
      "1healthylife.myshopify.com",
      "the-magnolia-sky.myshopify.com",
      "4babysonlinestore.myshopify.com",
      "luckypaw-1064.myshopify.com",
      "twingenuity-party-shop.myshopify.com",
      "northstylese.myshopify.com",
      "bedazzlepk.myshopify.com",
      "mysteryshirtclub.myshopify.com",
      "siyanse.myshopify.com",
      "gloryaccessory.myshopify.com",
      "heyspanish.myshopify.com",
      "hsin64534253.myshopify.com",
      "test123-5340.myshopify.com",
      "sculf.myshopify.com",
      "sol-eyes-creations.myshopify.com",
      "meemz-apparel.myshopify.com",
      "otaku-cat.myshopify.com",
      "talhashahbaz43.myshopify.com",
      "joacestore.myshopify.com",
      "garage-epoxy-usa.myshopify.com",
      "bebishirt.myshopify.com",
      "stops18.myshopify.com",
      "df0280.myshopify.com",
      "favorite-e-bike.myshopify.com",
      "vylome-2.myshopify.com",
      "lmd-graphix.myshopify.com",
      "goodscollectiveco.myshopify.com",
      "suprise-et-cadeau.myshopify.com",
      "western-water-gas.myshopify.com",
      "tbucktheme2.myshopify.com",
      "secret2022g-b.myshopify.com",
      "clean-tea-shop.myshopify.com",
      "mademebuy2.myshopify.com",
      "norientalism.myshopify.com",
      "sks-wholesale.myshopify.com",
      "3b-ranch.myshopify.com",
      "comercial-huma-8633.myshopify.com",
      "olivia-plum-beauty.myshopify.com",
      "mynanofresh.myshopify.com",
      "divine-home-ef92.myshopify.com",
      "wallcrypt.myshopify.com",
      "magnifixshop.myshopify.com",
      "letsmakeithome.myshopify.com",
      "gei-wholesale.myshopify.com",
      "crocs-jordan.myshopify.com",
      "nehomarket.myshopify.com",
      "shop-coospo.myshopify.com",
      "doublewoot.myshopify.com",
      "floppy-fish-2-0.myshopify.com",
      "euri-mattress.myshopify.com",
      "paper-pocket-au.myshopify.com",
      "daslabtest.myshopify.com",
      "cosyoffers.myshopify.com",
      "bebuiltdifferent-com.myshopify.com",
      "upperly-2879.myshopify.com",
      "west-clothing-a333.myshopify.com",
      "erckels.myshopify.com",
      "la-box-des-vinties.myshopify.com",
      "egyptianmoon.myshopify.com",
      "kellyjewelries.myshopify.com",
      "byoo-store.myshopify.com",
      "upperlyshop.myshopify.com",
      "audiokillmusic.myshopify.com",
      "adriana-deals.myshopify.com",
      "coin-certified.myshopify.com",
      "r3l3ntl3ss-jerry-lupotsky.myshopify.com",
      "klickdummy.myshopify.com",
      "a55efd.myshopify.com",
      "alejandro-carlin.myshopify.com",
      "repthelabel.myshopify.com",
      "vauntskincare.myshopify.com",
      "kenkashi-microbes.myshopify.com",
      "womatics.myshopify.com",
      "test-shop-stores.myshopify.com",
      "adornyourtable.myshopify.com",
      "craft-more-sun.myshopify.com",
      "euri-au.myshopify.com",
      "ariawatches.myshopify.com",
      "asunaro.myshopify.com",
      "julia-onboarding.myshopify.com",
      "b57297.myshopify.com",
      "helmeskin.myshopify.com",
      "colleenmariedesigns.myshopify.com",
      "click-agora.myshopify.com",
      "reginal-com.myshopify.com",
      "ivauntskincare.myshopify.com",
      "la-in-stoffe.myshopify.com",
      "del-hadi.myshopify.com",
      "officialtherosetoy.myshopify.com",
      "fuel2fit.myshopify.com",
      "spacependants.myshopify.com",
      "niqueforde.myshopify.com",
      "plates-4100.myshopify.com",
      "home-fitness-centre-store.myshopify.com",
      "shiliyiting.myshopify.com",
      "usefilhopet.myshopify.com",
      "byaylasss-de.myshopify.com",
      "centralight.myshopify.com",
      "stella-sol-sustainables.myshopify.com",
      "ahs-premier.myshopify.com",
      "atlantica-shopping-6321-3.myshopify.com",
      "cannabis-distribution-de.myshopify.com",
      "quality-xl.myshopify.com",
      "welove-kitchen-2.myshopify.com",
      "womaticstest.myshopify.com",
      "anotherdressofficial.myshopify.com",
      "vassla-sweden.myshopify.com",
      "izzetaybar2005.myshopify.com",
      "wessell-nickel-gross.myshopify.com",
      "ketology-web.myshopify.com",
      "nestlephilippines.myshopify.com",
      "littledoor-love.myshopify.com",
      "regalate-7539.myshopify.com",
      "avenirco-1656.myshopify.com",
      "helia-health.myshopify.com",
      "katasymbol.myshopify.com",
      "egyp-shops.myshopify.com",
      "breathe-in-peace.myshopify.com",
      "enpuly-fan-club.myshopify.com",
      "nadjalanany-shop.myshopify.com",
      "mr-and-missive.myshopify.com",
      "alfa-romeo-owners-club-parts.myshopify.com",
      "juanai.myshopify.com",
      "estilodevidaitaly.myshopify.com",
      "xinandvoltaire.myshopify.com",
      "cosyretailer.myshopify.com",
      "fishtek-supply-co.myshopify.com",
      "hitvapeuk.myshopify.com",
      "airboard-demo.myshopify.com",
      "map-of-the-heart-development.myshopify.com",
      "bmj7630.myshopify.com",
      "km-shop-dortmund.myshopify.com",
      "testshopfy00.myshopify.com",
      "thegarrison-dk.myshopify.com",
      "trenchmen-teas.myshopify.com",
      "rivaazfashions.myshopify.com",
      "jack-weir-and-sons.myshopify.com",
      "zileff.myshopify.com",
      "workbenchi.myshopify.com",
      "ombra-fitness.myshopify.com",
      "jack-weir-sons.myshopify.com",
      "beingtheelite.myshopify.com",
      "tien-store-theme-2.myshopify.com",
      "supvan-2.myshopify.com",
      "kuurth-fr.myshopify.com",
      "crown-nine.myshopify.com",
      "lidertest-spain.myshopify.com",
      "mylodi-1193.myshopify.com",
      "optical-x-change.myshopify.com",
      "medtechlife.myshopify.com",
      "5princess.myshopify.com",
      "muscletorque.myshopify.com",
      "mywoodyshop-4966.myshopify.com",
      "meatyour-by-shree-balaji-farms.myshopify.com",
      "shoptestdungpham.myshopify.com",
      "b-lights-shop.myshopify.com",
      "zovvofr.myshopify.com",
      "cristerashop.myshopify.com",
      "ilovefayealot.myshopify.com",
      "firstdistraction.myshopify.com",
      "opefac.myshopify.com",
      "ff-test123.myshopify.com",
      "mudalho-shop.myshopify.com",
      "549552.myshopify.com",
      "hairlando24.myshopify.com",
      "mya-shop-1215.myshopify.com",
      "cac2ba.myshopify.com",
      "isakdcorp.myshopify.com",
      "rhondasnaps.myshopify.com",
      "the-nougaterie-5522.myshopify.com",
      "jiggla.myshopify.com",
      "klatre-innovation.myshopify.com",
      "apps-testing-center.myshopify.com",
      "yummyland-1306.myshopify.com",
      "resplendid.myshopify.com",
      "uncoverys.myshopify.com",
      "koate.myshopify.com",
      "lamacrotienda-3966.myshopify.com",
      "dragon-peak.myshopify.com",
      "estherboutique.myshopify.com",
      "lux-babe-co.myshopify.com",
      "lvate-staging.myshopify.com",
      "evrocks.myshopify.com",
      "eefb4d.myshopify.com",
      "theradhatter.myshopify.com",
      "matural-in.myshopify.com",
      "artisanat-connect.myshopify.com",
      "simesy-faq-dev.myshopify.com",
      "2da089.myshopify.com",
      "lxhhxllxh57.myshopify.com",
      "oakfurnituresuperstore.myshopify.com",
      "aleecias-boutique-2.myshopify.com",
      "lacozystore.myshopify.com",
      "erzza-shop.myshopify.com",
      "maureen-fachinetti.myshopify.com",
      "fine-lines-store.myshopify.com",
      "jaderyquebec.myshopify.com",
      "maquiller-4035.myshopify.com",
      "minacare-6755.myshopify.com",
      "df7054-2.myshopify.com",
      "goleminipc.myshopify.com",
      "first-contact-technologies.myshopify.com",
      "offthegridstore-4730.myshopify.com",
      "rg-theperfectfit.myshopify.com",
      "7c7251.myshopify.com",
      "redergizer.myshopify.com"
    ];
    if (plan == "FREE" && !excludes.includes(shop)) {
      let faqs = formik?.values?.groups?.map((group) => {
        return group?.faqs;
      });
      faqs = _.flatten(faqs);
      console.log(faqs);
      if (shop == "rare-fratsen.myshopify.com") {
        if (faqs.length >= 12) {
          setIsReachLimit(true);
        }
      } else {
        if (faqs.length >= 10) {
          setIsReachLimit(true);
        }
      }
    }
  }

  useEffect(() => {
    checkLimit();
  }, [formik]);

  const importDemoFAQs = async () => {
    let { data } = await authAxios.post(`/api/faq/import-demo`, {
      shop
    });
    let newFaqGroup = data?.data?.faq?.map((item) => ({
      ...item?.config,
      id: item?._id,
    }));
    console.log(newFaqGroup);
    formik.setValues({ groups: newFaqGroup });
    setIsOpenModalSuccess(true);
  }

  const handleCreateFirstFAQ = async () => {
    let { data } = await authAxios.post("/api/faq-group/new", {
      shop,
      config: {
        name: "Frequently asked questions",
        checked: false,
        faqs: [],
        description: "Frequently asked questions",
        icon: "",
        translations: [],
      },
    });
    const newData = {
      id: data?.data?.faq?._id,
      ...data.data?.faq?.config,
    };
    formik.values.groups?.push(newData);
    handleOpenAddFaq(data.data.faq._id);
  }

  return (
    <Frame>
      <Page
        fullWidth={true}
        title="FAQs"
        primaryAction={{
          content: "Add FAQ Group",
          onAction: handleOpenAddGroup,
          disabled: isReachLimit,
        }}
      >
        <Layout>
          {isReachLimit && (
            <Layout.Section>
              <Banner
                status="warning"
                title="You've reached a threshold on your Free plan which allows 10 FAQs"
              >
                <TextContainer>
                  <p>
                    Upgrade to Premium plan to add unlimited FAQs. Premium
                    plan also unlocks access to exclusive features.
                  </p>
                  <Button primary url="/plan">
                    Start 7-days free trial
                  </Button>
                </TextContainer>
              </Banner>
            </Layout.Section>
          )}
          <Layout.Section>
            <div className="layout-group">
              {formik?.values?.groups?.length > 0 ? (
                formik.values.groups.map((item) => (
                  <React.Fragment key={item?.id}>
                    {renderGroup(item)}
                  </React.Fragment>
                ))
              ) : (
                <Card>
                  <div className="faq-empty">
                    <FormLayout>
                      <DisplayText size="small">
                        <span style={{"font-weight": "600"}}>You have no FAQs yet...</span>
                      </DisplayText>
                      <Button onClick={handleOpenAddGroup} primary>
                        Add FAQ Group
                      </Button>
                      <Button onClick={importDemoFAQs} plain>
                        Import Standard FAQs
                      </Button>
                    </FormLayout>
                  </div>
                </Card>
              )}
            </div>
          </Layout.Section>
          <Layout.Section secondary>
            <Card>
              <Card.Section>
                <TextContainer>
                  <h3 style={{"font-weight": "600", "font-size": "1.75rem"}}>Getting started</h3>
                  <p>Follow these articles to get started with the app:</p>
                  <ul>
                    <li><Link url="https://docs.simesy.com/article/4-getting-started">Getting started guide</Link></li>
                    <li><Link url="https://docs.simesy.com/article/5-how-to-create-a-faq-page">How to create a FAQ page ?</Link></li>
                    <li><Link url="https://docs.simesy.com/article/6-how-to-create-a-faq-accordion">How to create a FAQ accordion</Link></li>
                    <li><Link url="https://docs.simesy.com/article/7-display-faq-accordion-on-homepage">Display FAQ accordion on homepage</Link></li>
                    <li><Link url="https://docs.simesy.com/article/8-display-faq-accordion-on-product-page">Display FAQ accordion on product page</Link></li>
                    <li><Link url="https://docs.simesy.com/article/9-display-faq-accordion-on-normal-page">Display FAQ accordion on normal page</Link></li>
                  </ul>
                  <p>Additional help can be found at our docs:</p>
                  <Button url="https://docs.simesy.com/collection/1-faq-page-product-faq">View docs</Button>
                </TextContainer>
              </Card.Section>
              <Card.Section>
                <TextContainer>
                  <h3 style={{"font-weight": "600", "font-size": "1.75rem"}}>Friendly support</h3>
                  <p>Need help? We're available to answer questions and help setup. Contact us using the live chat widget near the bottom of your screen.</p>
                </TextContainer>
              </Card.Section>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
      
      {/* {(enableApp != null && !enableApp) && (
        <ModalEnableAppEmbed
          enableApp={enableApp}
          checkEnableApp={checkEnableApp}
          setEnableApp={setEnableApp}
          url={`https://admin.shopify.com/store/${shopName}/themes/${mainThemeID}/editor?context=apps&activateAppId=${UUID}/simesy-faq-script`}
        />
      )} */}

      {isFirstTime && (
        <ModalGettingStarted
          url={`https://admin.shopify.com/store/${shopName}/themes/${mainThemeID}/editor?context=apps&activateAppId=${UUID}/simesy-faq-script`}
        />
      )}

      {isOpenModalAddFaq && (
        <ModalAddFaq
          onSubmit={faqData ? handleEditFaq : handleAddFaq}
          shop={shop}
          locales={locales}
          localeOptions={localeOptions}
          visible={true}
          plan={plan}
          faqData={faqData}
          onCancel={() => {
            setIsOpenModalAddFaq(false);
            setFaqId("");
            setFaqData("");
            setGroupId("");
          }}
        />
      )}

      {isOpenModalAddGroup && (
        <ModalAddFaqGroup
          groupData={groupData}
          onSubmit={groupData ? handleEditGroup : handleAddGroupFaq}
          shop={shop}
          locales={locales}
          localeOptions={localeOptions}
          visible={true}
          plan={plan}
          onCancel={() => {
            setIsOpenModalAddGroup(false);
            setGroupId("");
            setGroupData("");
          }}
        />
      )}
      {messageSuccess()}
      {errorMarkup()}
    </Frame>
  );
}

export default FaqComponent;
