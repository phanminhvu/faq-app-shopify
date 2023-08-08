import {
  Modal,
  FormLayout,
  Select,
  Heading,
  TextField,
  Stack,
  Badge,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import RequestCustom from "../constants/request";
import { useFormik } from "formik";
import UpgradePlan from "./UpgradePlan";
import { icons, SHOP_PLAN } from "../constants";
import CustomField from "./CustomField";

const ModalAddFaqGroup = (props) => {
  const {
    visible,
    onCancel,
    shop,
    onSubmit,
    groupData,
    locales,
    localeOptions,
    plan
  } = props;
  const [translations, setTranslations] = useState([]);
  const formik = useFormik({
    initialValues: {
      groupName: "",
      description: "",
      translations: "en",
      groupNameTranslation: "",
      groupDescriptionTranslation: "",
      icon: "",
    },
  });
  const isDisabled = plan === SHOP_PLAN.FREE;

  useEffect(() => {
    if (groupData?.translations?.length > 0) {
      const newTranslations = groupData?.translations?.map((item) => {
        return {
          translations: item?.locale,
          groupNameTranslation: item?.name,
          groupDescriptionTranslation: item?.description,
        };
      });
      setTranslations(newTranslations);
    }
  }, [groupData]);

  useEffect(() => {
    const script = document.createElement('script');
    const link = document.createElement('link');
  
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/js/all.min.js";
    link.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css";
    script.async = true;
  
    document.body.appendChild(script);
    document.body.appendChild(link);
  
    return () => {
      document.body.removeChild(script);
      document.body.removeChild(link);
    }
  }, []);

  useEffect(() => {
    if (groupData) {
      const data = {
        groupName: groupData?.name ? groupData?.name : "",
        description: groupData?.description ? groupData?.description : "",
        icon: groupData?.icon ? groupData?.icon : "",
        translations:
          locales?.length > 0
            ? locales.find((locale) => locale.primary)?.locale
            : "",
        groupNameTranslation: "",
        groupDescriptionTranslation: "",
      };
      formik.setValues({ ...data });
    }
  }, [groupData, locales]);

  const handleChange = useCallback(
    (value, id) => {
      formik.handleChange({ target: { id, value } });

      if (id === "translations") {
        if (
          !translations?.some((item) => item?.translations === value) &&
          locales.find((locale) => locale.primary)?.locale !== value
        ) {
          translations.push({
            translations: value,
            groupNameTranslation: "",
            groupDescriptionTranslation: "",
          });
          setTranslations(translations);
          formik.handleChange({
            target: { id: "groupNameTranslation", value: "" },
          });
          formik.handleChange({
            target: { id: "groupDescriptionTranslation", value: "" },
          });
          return;
        }
        const data = translations?.find((item) => item?.translations === value);

        if (data) {
          formik.handleChange({
            target: {
              id: "groupNameTranslation",
              value: data?.groupNameTranslation,
            },
          });
          formik.handleChange({
            target: {
              id: "groupDescriptionTranslation",
              value: data?.groupDescriptionTranslation,
            },
          });
        }
        return;
      }
      if (
        (id === "groupNameTranslation" || id === "groupDescriptionTranslation")
      ) {
        const newTranslations = translations.map((item) => {
          if (item?.translations === formik.values.translations) {
            return { ...item, [id]: value };
          }
          return item;
        });
        setTranslations(newTranslations);
        return;
      }
    },
    [translations, formik.values, locales]
  );

  const handleSubmit = useCallback(() => {
    let translationsData = [];
    translations?.map((item) => {
      if (item?.translations) {
        translationsData.push({
          locale: item?.translations,
          name: item?.groupNameTranslation ? item?.groupNameTranslation : "",
          description: item?.groupDescriptionTranslation ? item?.groupDescriptionTranslation : "",
        });
      }
    });
    onSubmit({
      ...formik.values,
      translationsUpdate: translationsData,
    });
  }, [translations, formik.values]);

  const translationsSelected = () => {
    return (
      <Stack spacing="extraTight">
        {locales?.map(
          (el) =>
            el?.published && (
              <Badge
                key={el.locale}
                status={
                  groupData?.translations &&
                  groupData?.translations.some(
                    (locale) => locale?.locale === el?.locale
                  ) || el?.primary
                    ? "success"
                    : "warning"
                }
                progress="complete"
              >
                {el?.name}
              </Badge>
            )
        )}
      </Stack>
    );
  };

  const handleSelectIcon = useCallback((icon) => {
     formik.handleChange({target: {id: 'icon', value: icon}});
  }, [formik]);

  return (
    localeOptions?.length > 0 &&
    (
      <Modal
        open={visible}
        large
        title={groupData ? "Edit FAQ Group" : "Add FAQ Group"}
        primaryAction={{
          content: "Save",
          onAction: handleSubmit,
        }}
        onClose={onCancel}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: onCancel,
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              name="groupName"
              id="groupName"
              label="Group Name"
              onChange={handleChange}
              value={formik.values.groupName}
            />

            <TextField
              name="description"
              id="description"
              label="Group Description"
              value={formik.values.description}
              multiline={3}
              onChange={handleChange}
            />

            <CustomField label="Icon">
              <div className="icon-list">
                {icons.map(item => (
                  <div class={`icon-item ${formik.values.icon === item.trim() ? 'active selected':''}`} onClick={() => handleSelectIcon(item.trim())}>
                  <i className={`${item.trim()}`} ></i>
                  </div>
                ))}
              </div>
            </CustomField>

            <Select
              name="translations"
              id="translations"
              value={formik.values.translations}
              label={<div className="field-premium">Translations {isDisabled && <UpgradePlan />}</div>}
              onChange={handleChange}
              disabled={isDisabled}
              options={localeOptions}
              helpText={translationsSelected()}
            />
          </FormLayout>
        </Modal.Section>
        {formik?.values?.translations && !isDisabled &&
          locales?.length > 0 &&
          JSON.stringify(formik?.values?.translations) !==
            JSON.stringify(
              locales.find((locale) => locale.primary)?.locale
            ) && (
            <Modal.Section>
              <FormLayout>
                <Heading>
                  {locales.find(
                    (locale) => locale.locale === formik?.values?.translations
                  )?.name +
                    " (" +
                    locales.find(
                      (locale) => locale.locale === formik?.values?.translations
                    )?.locale +
                    ")"}
                </Heading>

                <TextField
                  name="groupNameTranslation"
                  id="groupNameTranslation"
                  label="Group Name"
                  value={formik.values.groupNameTranslation}
                  onChange={handleChange}
                />

                <TextField
                  name="groupDescriptionTranslation"
                  id="groupDescriptionTranslation"
                  value={formik.values.groupDescriptionTranslation}
                  label="Group Description"
                  multiline={3}
                  onChange={handleChange}
                />
              </FormLayout>
            </Modal.Section>
          )}
      </Modal>
    )
  );
};
export default ModalAddFaqGroup;
