import Editor from "@monaco-editor/react";
import {
  Card,
  ChoiceList,
  Form,
  FormLayout,
  RangeSlider,
  Select,
  TextField,
  TextStyle,
  Link,
  Banner
} from "@shopify/polaris";
import React, { useRef, useState } from "react";
import {
  optionFAQBehavior,
  optionFAQExtra,
  optionFAQIconPosition,
  optionFAQNameTag,
  // optionFonStyle,
  optionIconStyle,
  optionsTextStyle,
  optionsFontWeight,
  SHOP_PLAN,
  optionsTextAlign,
} from "../constants";
import { useOutsideAlerter } from "../constants/function";
import CustomColorPicker from "./CustomColorPicker";
import CustomField from "./CustomField";
import SelectMutileValueSortElement from "./SelectMultipleSortElement";
import UpgradePlan from "./UpgradePlan";

export default function WidgetTabLeft({
  formik,
  handleChange,
  faqGroup,
  handleOpenSetColor,
  colorPagination,
  handleChangeSetColor,
  dataBackUp,
  errorNameWidget,
  plan,
  isViewOnboard
}) {
  const isDisabled = plan === SHOP_PLAN.FREE;
  const [isOpen, setIsOpen] = useState(false);

  const refSelectMultile = useRef(null);
  useOutsideAlerter(refSelectMultile, () => setIsOpen(false));

  const handleOpenSelectMultile = () => {
    setIsOpen(!isOpen);
  };

  const handleEditorChange = (value, e) => {
    formik.handleChange({ target: { id: "customCss", value } });
  };

  const CustomStyleChoice = () => {
    return (
      <div className="field-premium">
        Custom {isDisabled && <UpgradePlan />}
      </div>
    )
  }

  const optionFonStyle = (isDisabled) => {
    return [
      { label: "Style 1", value: "style1" },
      { label: "Style 2", value: "style2" },
      { label: "Style 3", value: "style3" },
      { label: "Style 4", value: "style4" },
      { label: "Style 5", value: "style5" },
      { label: CustomStyleChoice(), value: "custom", disabled: isDisabled },
    ]
  }

  return (
    <>
      <div style={{marginBottom: "1.6rem"}}>
        <Banner title=" This app is 100% customizable" status="info" onDismiss={() => {}}>
        Please message us for free assistance matching the FAQ accordion with your theme!
        </Banner>
      </div>
      <Card title="Accordion Title">
        <Card.Section>
          <TextField
            id="title"
            name="title"
            error={!formik.values.title ? errorNameWidget : ""}
            value={formik.values.title}
            onChange={handleChange}
          />
        </Card.Section>
      </Card>
      <Card title="FAQ Select">
        <Card.Section>
          <FormLayout>
            <CustomField label="FAQ Groups">
              <div ref={refSelectMultile} onClick={handleOpenSelectMultile}>
                <SelectMutileValueSortElement
                  isOpen={isOpen}
                  formik={formik}
                  keys="faqGroup"
                  keyChild="faqGroup"
                  data={faqGroup}
                />
              </div>
            </CustomField>
            <div>
            <ChoiceList
              title="FAQ Style"
              id="faqStyleID"
              name="faqStyleID"
              choices={optionFonStyle(isDisabled)}
              selected={formik.values.faqStyleID}
              onChange={handleChange}
            />
            <TextStyle variation="subdued">You can see all the demo <Link external url="https://simesy-faq.myshopify.com/pages/demo-styles">here</Link> (password: shopify)</TextStyle>
            </div>
          </FormLayout>
        </Card.Section>
      </Card>
      {(formik?.values?.faqStyleID?.includes("custom") || isDisabled) && (
        <Card title={
          <div>
            <h2 class="Polaris-Heading">Custom Style</h2> {isDisabled && <div style={{marginTop: "0.8rem"}}><UpgradePlan /></div>}
          </div>
        }>
          <Card.Section title="Group Name">
            <FormLayout>
              <CustomField label="Font Size">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    columnGap: "10px",
                    alignItems: "center",
                  }}
                  className={`${isViewOnboard ? 'form-field-range-number':''}`}
                >
                  <RangeSlider
                    disabled={isDisabled}
                    min={10}
                    max={40}
                    name="groupNameFontSize"
                    id="groupNameFontSize"
                    value={Number(formik.values.groupNameFontSize)}
                    onChange={handleChange}
                    output
                  />
                  <TextField
                    disabled={isDisabled}
                    min={10}
                    max={40}
                    type="number"
                    id="groupNameFontSize"
                    name="groupNameFontSize"
                    value={formik.values.groupNameFontSize.toString()}
                    onChange={handleChange}
                  />
                </div>
              </CustomField>

              <Select
                disabled={isDisabled}
                name="groupNameFontWeight"
                id="groupNameFontWeight"
                value={formik.values.groupNameFontWeight}
                label="Font Weight"
                onChange={handleChange}
                options={optionsFontWeight}
              />

              <Select
                disabled={isDisabled}
                name="groupNameTextStyle"
                id="groupNameTextStyle"
                value={formik.values.groupNameTextStyle}
                label="Text Style"
                onChange={handleChange}
                options={optionsTextStyle}
              />

              <Select
                disabled={isDisabled}
                name="groupNameTextAlign"
                id="groupNameTextAlign"
                value={formik.values.groupNameTextAlign}
                label="Text Align"
                onChange={handleChange}
                options={optionsTextAlign}
              />

              <CustomColorPicker
                disabled={isDisabled}
                title="Text Color"
                nameKey="groupNameColor"
                handleChangeSetColor={handleChangeSetColor}
                backgroundColorBackUp={formik.values.groupNameColor}
                handleOpenSetColor={handleOpenSetColor}
                colorPagination={colorPagination}
                backgroundColor={dataBackUp.groupNameColor}
              />
            </FormLayout>
          </Card.Section>
          <Card.Section title="Question">
            <FormLayout>
              <CustomField label="Font Size">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    columnGap: "10px",
                    alignItems: "center",
                  }}
                  className={`${isViewOnboard ? 'form-field-range-number':''}`}
                >
                  <RangeSlider
                    disabled={isDisabled}
                    min={10}
                    max={40}
                    name="questionFontSize"
                    id="questionFontSize"
                    value={Number(formik.values.questionFontSize)}
                    onChange={handleChange}
                    output
                  />
                  <TextField
                    disabled={isDisabled}
                    min={10}
                    max={40}
                    type="number"
                    id="questionFontSize"
                    name="questionFontSize"
                    value={formik.values.questionFontSize.toString()}
                    onChange={handleChange}
                  />
                </div>
              </CustomField>
              <Select
                disabled={isDisabled}
                name="questionFontWeight"
                id="questionFontWeight"
                value={formik.values.questionFontWeight}
                label="Font Weight"
                onChange={handleChange}
                options={optionsFontWeight}
              />
               <CustomColorPicker
                disabled={isDisabled}
                title="Background Color"
                nameKey="questionBgColor"
                handleChangeSetColor={handleChangeSetColor}
                backgroundColorBackUp={formik.values.questionBgColor}
                handleOpenSetColor={handleOpenSetColor}
                colorPagination={colorPagination}
                backgroundColor={dataBackUp.questionBgColor}
              />
              <CustomColorPicker
                disabled={isDisabled}
                title="Text Color"
                nameKey="questionTextColor"
                handleChangeSetColor={handleChangeSetColor}
                backgroundColorBackUp={formik.values.questionTextColor}
                handleOpenSetColor={handleOpenSetColor}
                colorPagination={colorPagination}
                backgroundColor={dataBackUp.questionTextColor}
              />
              <CustomColorPicker
                disabled={isDisabled}
                title="Hover Background Color"
                nameKey="questionHoverColor"
                handleChangeSetColor={handleChangeSetColor}
                backgroundColorBackUp={formik.values.questionHoverColor}
                handleOpenSetColor={handleOpenSetColor}
                colorPagination={colorPagination}
                backgroundColor={dataBackUp.questionHoverColor}
              />
            </FormLayout>
          </Card.Section>
          <Card.Section title="Answer">
            <FormLayout>
              <CustomField label="Font Size">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    columnGap: "10px",
                    alignItems: "center",
                  }}
                  className={`${isViewOnboard ? 'form-field-range-number':''}`}
                >
                  <RangeSlider
                    disabled={isDisabled}
                    min={10}
                    max={40}
                    name="answerFontSize"
                    id="answerFontSize"
                    value={Number(formik.values.answerFontSize)}
                    onChange={handleChange}
                    output
                  />
                  <TextField
                    disabled={isDisabled}
                    min={10}
                    max={40}
                    type="number"
                    id="answerFontSize"
                    name="answerFontSize"
                    value={formik.values.answerFontSize.toString()}
                    onChange={handleChange}
                  />
                </div>
              </CustomField>
              <Select
                disabled={isDisabled}
                name="answerFontWeight"
                id="answerFontWeight"
                value={formik.values.answerFontWeight}
                label="Font Weight"
                onChange={handleChange}
                options={optionsFontWeight}
              />
              <CustomColorPicker
                disabled={isDisabled}
                title="Background Color"
                nameKey="answerBgColor"
                handleChangeSetColor={handleChangeSetColor}
                backgroundColorBackUp={formik.values.answerBgColor}
                handleOpenSetColor={handleOpenSetColor}
                colorPagination={colorPagination}
                backgroundColor={dataBackUp.answerBgColor}
              />
              <CustomColorPicker
                disabled={isDisabled}
                title="Text Color"
                nameKey="answerTextColor"
                handleChangeSetColor={handleChangeSetColor}
                backgroundColorBackUp={formik.values.answerTextColor}
                handleOpenSetColor={handleOpenSetColor}
                colorPagination={colorPagination}
                backgroundColor={dataBackUp.answerTextColor}
              />
            </FormLayout>
          </Card.Section>
        </Card>
      )}
      <Card title="Customize FAQ">
        <Card.Section>
          <FormLayout>
            <ChoiceList
              id="faqBehavior"
              name="faqBehavior"
              title="FAQ Behavior"
              choices={optionFAQBehavior}
              selected={formik.values.faqBehavior}
              onChange={handleChange}
            />
            <RangeSlider
              label="FAQ accordian width"
              min={800}
              max={1400}
              step={20}
              output={true}
              id="maxWidth"
              name="maxWidth"
              value={formik.values.maxWidth.toString()}
              onChange={handleChange}
            />
            <ChoiceList
              title="Display Group Name"
              id="faqNameTag"
              name="faqNameTag"
              choices={optionFAQNameTag}
              selected={formik.values.faqNameTag}
              onChange={handleChange}
            />
            <ChoiceList
              title="Icon Position"
              id="faqIconPosition"
              name="faqIconPosition"
              choices={optionFAQIconPosition}
              selected={formik.values.faqIconPosition}
              onChange={handleChange}
            />
            <ChoiceList
              title="Extras"
              id="faqExtras"
              name="faqExtras"
              choices={optionFAQExtra}
              selected={formik.values.faqExtras}
              onChange={handleChange}
            />

            <CustomField label="Icon Size">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  columnGap: "10px",
                  alignItems: "center",
                }}
                className={`${isViewOnboard ? 'form-field-range-number':''}`}
              >
                <RangeSlider
                  min={16}
                  max={24}
                  name="faqIconSize"
                  id="faqIconSize"
                  value={Number(formik.values.faqIconSize)}
                  onChange={handleChange}
                  output
                />
                <TextField
                  min={16}
                  max={24}
                  type="number"
                  id="faqIconSize"
                  name="faqIconSize"
                  value={formik.values.faqIconSize.toString()}
                  onChange={handleChange}
                />
              </div>
            </CustomField>

            <div className="choice-list">
              <ChoiceList
                id="faqIconSelect"
                name="faqIconSelect"
                title="Icon Select"
                choices={optionIconStyle}
                selected={formik?.values?.faqIconSelect}
                onChange={handleChange}
              />
            </div>
            {!formik.values.faqStyleID.includes("custom") && (
              <div style={{ paddingTop: "5px" }}>
                <FormLayout>
                  <CustomColorPicker
                    title="Collapsed Question Color"
                    nameKey="faqQuestionCloseColor"
                    handleChangeSetColor={handleChangeSetColor}
                    backgroundColorBackUp={formik.values.faqQuestionCloseColor}
                    // description="Set image box-shadow color."
                    handleOpenSetColor={handleOpenSetColor}
                    colorPagination={colorPagination}
                    backgroundColor={dataBackUp.faqQuestionCloseColor}
                  />
                  <CustomColorPicker
                    title="Expanded Question Color"
                    nameKey="faqQuestionOpenColor"
                    handleChangeSetColor={handleChangeSetColor}
                    backgroundColorBackUp={formik.values.faqQuestionOpenColor}
                    // description="Set image box-shadow color."
                    handleOpenSetColor={handleOpenSetColor}
                    colorPagination={colorPagination}
                    backgroundColor={dataBackUp.faqQuestionOpenColor}
                  />
                  <CustomColorPicker
                    title="Collapse Icon Color"
                    nameKey="faqIconCloseColor"
                    handleChangeSetColor={handleChangeSetColor}
                    backgroundColorBackUp={formik.values.faqIconCloseColor}
                    // description="Set image box-shadow color."
                    handleOpenSetColor={handleOpenSetColor}
                    colorPagination={colorPagination}
                    backgroundColor={dataBackUp.faqIconCloseColor}
                  />
                  <CustomColorPicker
                    title="Expand Icon Color"
                    nameKey="faqIconOpenColor"
                    handleChangeSetColor={handleChangeSetColor}
                    backgroundColorBackUp={formik.values.faqIconOpenColor}
                    // description="Set image box-shadow color."
                    handleOpenSetColor={handleOpenSetColor}
                    colorPagination={colorPagination}
                    backgroundColor={dataBackUp.faqIconOpenColor}
                  />
                </FormLayout>
              </div>
            )}
          </FormLayout>
        </Card.Section>
      </Card>
      <Card title="Custom CSS">
        <Card.Section>
          <CustomField label="CSS">
            <div
              style={{
                backgroundColor: "var(--p-surface)",
                border: "1px solid var(--p-border-subdued)",
                borderTopColor: "var(--p-border-shadow)",
                borderRadius: "var(--p-border-radius-base)",
              }}
            >
              <Editor
                height="500px"
                defaultLanguage="css"
                theme="light"
                value={formik.values.customCss}
                onChange={handleEditorChange}
              />
            </div>
          </CustomField>
        </Card.Section>
      </Card>
    </>
  );
}
