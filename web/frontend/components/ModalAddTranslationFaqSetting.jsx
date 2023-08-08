import {
  Badge,
  FormLayout,
  Heading,
  Modal,
  Select,
  Stack,
  TextField,
} from "@shopify/polaris";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { SHOP_PLAN } from "../constants";
import UpgradePlan from "./UpgradePlan";

const ModalAddTranslations = (props) => {
  const {
    visible,
    onCancel,
    shop,
    onSubmit,
    data,
    locales,
    localeOptions,
    plan,
    transitionsSetting,
  } = props;
  const isDisabled = plan === SHOP_PLAN.FREE;
  const localeDefault = locales.find((item) => item.primary)?.name
    ? locales.find((item) => item.primary)?.name + " (Default)"
    : "";
  const [translateData, setTranslateData] = useState([]);

  const formik = useFormik({
    initialValues: {
      default: "",
      translations: "en",
      translate: "",
    },
  });

  useEffect(() => {
    if (transitionsSetting) {
      let translations = [];
      for (const locale in transitionsSetting) {
        if (transitionsSetting[locale] && transitionsSetting[locale]?.hasOwnProperty(data?.name)) {
          translations.push({
            locale,
            translate: transitionsSetting[locale][data?.name],
          });
        }
      }
      setTranslateData(translations);
    }
  }, [transitionsSetting, data?.name]);

  useEffect(() => {
    if (data?.value) {
      const formValue = {
        default: data?.value,
        translations:
          locales?.length > 0
            ? locales.find((locale) => locale.primary)?.locale
            : "",
      };
      formik.setValues({ ...formValue });
    }
  }, [data?.value, locales]);

  const handleChange = (value, id) => {
    formik.handleChange({ target: { id, value } });
    if (id === "translations") {
      if (
        !translateData?.some((item) => item?.locale === value) &&
        locales.find((locale) => locale.primary)?.locale !== value
      ) {
        translateData.push({
          locale: value,
          translate: "",
        });
        setTranslateData(translateData);
        formik.handleChange({
          target: { id: "translate", value: "" },
        });

        return;
      }
      const translationValue = translateData?.find(
        (item) => item?.locale === value
      );

      if (translationValue) {
        formik.handleChange({
          target: {
            id: "translate",
            value: translationValue?.translate,
          },
        });
      }
      return;
    }
    if (id === "translate") {
      const newTranslate = translateData.map((item) => {
        if (item?.locale === formik.values.translations) {
          return { ...item, [id]: value };
        }
        return item;
      });
      setTranslateData(newTranslate);
      return;
    }
  };

  const handleSubmit = useCallback(() => {
    onSubmit({
      ...formik.values,
      translations: translateData,
      name: data?.name,
    });
    onCancel();
    formik.resetForm();
  },[translateData, formik.values, data?.name]);

  const translations = () => {
    return (
      <Stack spacing="extraTight">
        {locales?.map(
          (el) =>
            el?.published && (
              <Badge
                key={el.locale}
                status={
                  transitionsSetting && data?.name && transitionsSetting[el.locale]?.hasOwnProperty(data?.name) && transitionsSetting[el.locale][data?.name] ||
                  el?.primary
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

  return (
    localeOptions?.length > 0 &&
    locales?.length > 0 && (
      <Modal
        open={visible}
        title={data?.title}
        primaryAction={{
          content: "Add",
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
              value={formik.values.default}
              name={"default"}
              label={localeDefault}
              disabled={isDisabled}
              onChange={handleChange}
              id={"default"}
            />

            <Select
              name="translations"
              id="translations"
              value={formik.values.translations}
              label={
                <div className="field-premium">
                  Translations {isDisabled && <UpgradePlan />}
                </div>
              }
              onChange={handleChange}
              disabled={isDisabled}
              options={localeOptions}
              helpText={translations()}
            />
          </FormLayout>
        </Modal.Section>
        {formik?.values?.translations &&
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
                  name="translate"
                  id="translate"
                  ariaExpanded
                  label={data?.title}
                  value={formik.values.translate}
                  onChange={handleChange}
                />
              </FormLayout>
            </Modal.Section>
          )}
      </Modal>
    )
  );
};
export default ModalAddTranslations;
