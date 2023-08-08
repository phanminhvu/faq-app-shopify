import {
  Modal,
  FormLayout,
  Select,
  Heading,
  TextField,
  Stack,
  Badge,
} from "@shopify/polaris";
import { useEffect, useRef, useState } from "react";
import UpgradePlan from "./UpgradePlan";
import { useFormik } from "formik";
import { useCallback } from "react";
import { SHOP_PLAN } from "../constants";
import $ from "jquery";

const ModalAddFaq = (props) => {
  const {
    visible,
    onCancel,
    shop,
    onSubmit,
    faqData,
    locales,
    localeOptions,
    plan,
  } = props;
  const editorRef = useRef();
  const [translations, setTranslations] = useState([]);
  const { CKEditor, ClassicEditor } = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [isChangeAnswer, setIsChangeAnswer] = useState(true);
  const isDisabled = plan === SHOP_PLAN.FREE;
  const formik = useFormik({
    initialValues: {
      question: "",
      answer: "",
      translations:
        locales?.length > 0
          ? locales.find((locale) => locale.primary)?.locale
          : "",
      questionTranslation: "",
      answerTranslation: "",
    },
  });

  useEffect(() => {
    if (faqData) {
      const data = {
        answer: faqData?.answer ? faqData?.answer : "",
        question: faqData?.question ? faqData?.question : "",
        translations:
          locales?.length > 0
            ? locales.find((locale) => locale.primary)?.locale
            : "",
        questionTranslation: "",
        answerTranslation: "",
      };
      formik.setValues({ ...data });
      setAnSwerTranslation("");
    }
  }, [faqData, locales]);

  const handleChangeAnswer = (e) => {
    formik.handleChange({ target: { id: "answer", value: e } });
  };
  const [answerTranslation, setAnSwerTranslation] = useState("");
  const handleChangeAnswerTranslation = useCallback(
    (e) => {
      setAnSwerTranslation(e);
    },
    [isChangeAnswer, formik, translations]
  );

  useEffect(() => {
    if (faqData?.translations?.length > 0) {
      const newTranslations = faqData?.translations?.map((item) => {
        return {
          translations: item?.locale,
          answerTranslation: item?.answer,
          questionTranslation: item?.question,
        };
      });
      setTranslations(newTranslations);
    }
  }, [faqData]);

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic")
    };

    setEditorLoaded(true);
  }, []);

  useEffect(() => {
    if ($) {
      $(".Polaris-Modal-Dialog").removeAttr("tabindex");
    }
  }, [$]);

  const handleChange = useCallback(
    (value, id) => {
      formik.handleChange({ target: { id, value } });
      let translationData = translations;
      if (answerTranslation) {
        translationData = translationData.map((item) => {
          if (item?.translations === formik.values.translations) {
            return { ...item, answerTranslation };
          }
          return item;
        });
      }
      if (id === "translations") {
        if (
          !translationData?.some((item) => item?.translations == value) &&
          locales.find((locale) => locale.primary)?.locale != value
        ) {
          translationData.push({
            translations: value,
            questionTranslation: "",
            answerTranslation: "",
          });
          formik.handleChange({
            target: { id: "questionTranslation", value: "" },
          });
          setAnSwerTranslation("");
        } else {
          const data = translations?.find(
            (item) => item?.translations === value
          );

          if (data) {
            formik.handleChange({
              target: {
                id: "questionTranslation",
                value: data?.questionTranslation,
              },
            });
            formik.handleChange({
              target: {
                id: "answerTranslation",
                value: data?.answerTranslation,
              },
            });
            setAnSwerTranslation(data?.answerTranslation);
          }
        }
      }

      if (id === "questionTranslation") {
        translationData = translationData.map((item) => {
          if (item?.translations === formik.values.translations) {
            return { ...item, [id]: value };
          }
          return item;
        });
      }
      setTranslations(translationData);
    },
    [translations, formik.values, locales, answerTranslation]
  );

  const handleSubmit = useCallback(() => {
    let translationsData = [];
    translations?.map((item) => {
      if (
        item?.translations &&
        item?.translations === formik.values.translations
      ) {
        translationsData.push({
          locale: item?.translations,
          answer:
            item?.translations === formik.values.translations
              ? answerTranslation
              : item?.answerTranslation,
          question: item?.questionTranslation ? item?.questionTranslation : "",
        });
      }
    });
    onSubmit({
      ...formik.values,
      translationsUpdate: translationsData,
    });
  }, [translations, formik.values, answerTranslation]);

  const renderCkEditor = useCallback(() => {
    return (
      typeof window !== "undefined" &&
      editorLoaded &&
      CKEditor &&
      ClassicEditor && (
        <CKEditor
          editor={ClassicEditor}
          config={{
            link: {
              decorators: {
                openInNewTab: {
                  mode: "manual",
                  label: "Open in a new tab",
                  attributes: {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  },
                },
              },
            },
          }}
          onReady={(editor) => {}}
          data={formik.values.answer}
          onChange={(event, editor) => {
            const data = editor.getData();
            handleChangeAnswer(data);
          }}
        />
      )
    );
  }, [ClassicEditor, editorLoaded, CKEditor, handleChangeAnswer, formik]);

  const renderCkEditorAnswerTranslation = useCallback(() => {
    return (
      typeof window !== "undefined" &&
      editorLoaded &&
      CKEditor &&
      ClassicEditor && (
        <CKEditor
          editor={ClassicEditor}
          onReady={(editor) => {}}
          data={answerTranslation}
          onChange={(event, editor) => {
            const data = editor.getData();
            handleChangeAnswerTranslation(data);
          }}
        />
      )
    );
  }, [
    ClassicEditor,
    editorLoaded,
    CKEditor,
    handleChangeAnswerTranslation,
    answerTranslation,
  ]);

  const translationsSelected = () => {
    return (
      <Stack spacing="extraTight">
        {locales?.map(
          (el) =>
            el?.published && (
              <Badge
                key={el.locale}
                status={
                  (faqData?.translations?.length > 0 &&
                    faqData?.translations.some(
                      (locale) => locale?.locale === el?.locale
                    )) ||
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
      <>
        <style>{`
        .Polaris-Modal-CloseButton {
          display: none;
        }
      `}</style>
        <Modal
          large
          open={visible}
          title={faqData ? "Edit FAQ" : "Add New FAQ"}
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
                value={formik.values.question}
                name="question"
                onChange={handleChange}
                label="Question"
                id="question"
              />

              {renderCkEditor()}

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
                options={localeOptions}
                disabled={isDisabled}
                helpText={translationsSelected()}
              />
            </FormLayout>
          </Modal.Section>
          {formik?.values?.translations &&
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
                        (locale) =>
                          locale.locale === formik?.values?.translations
                      )?.locale +
                      ")"}
                  </Heading>

                  <TextField
                    name="questionTranslation"
                    id="questionTranslation"
                    label="Question"
                    value={formik.values.questionTranslation}
                    onChange={handleChange}
                  />

                  {renderCkEditorAnswerTranslation()}
                </FormLayout>
              </Modal.Section>
            )}
        </Modal>
      </>
    )
  );
};
export default ModalAddFaq;
