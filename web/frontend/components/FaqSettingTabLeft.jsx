import Editor from "@monaco-editor/react";
import {
  Button, Card, Checkbox, ChoiceList,
  FormLayout, RangeSlider, Select, TextField,
  TextStyle, Link, Banner
} from "@shopify/polaris";
import { LanguageMinor } from "@shopify/polaris-icons";
import React, { useRef, useState } from "react";
import {
  optionFAQBehavior,
  optionFAQExtra,
  optionFAQIconPosition,
  optionFAQNameTag,
  optionFonStyle,
  optionIconStyle,
  optionNavigationStyle,
  optionsFontWeight,
  optionsTextAlign,
  optionsTextStyle,
  SHOP_PLAN
} from "../constants";
import { useOutsideAlerter } from "../constants/function";
import CustomColorPicker from "./CustomColorPicker";
import CustomField from "./CustomField";
import ModalAddTranslations from "./ModalAddTranslationFaqSetting";
import SelectMutileValueSortElement from "./SelectMultipleSortElement";
import UpgradePlan from "./UpgradePlan";

export default function FaqSettingTabLeft({
  formik,
  handleChange,
  groups,
  handleOpenSetColor,
  colorPagination,
  handleChangeSetColor,
  dataBackUp,
  errorNameWidget,
  shop,
  localeOptions,
  locales,
  plan,
  transitionsSetting,
  handleAddTranslation,
  isViewOnboard
}) {
  const isDisabled = plan === SHOP_PLAN.FREE;
  const optionsSelectThemes = [
    { label: 'Theme Default', value: 'theme0' },
    { label: !isDisabled ? 'Theme 1' : 'Theme 1 (PREMIUM ONLY)', value: 'theme1', disabled: isDisabled },
    { label: !isDisabled ? 'Theme 2' : 'Theme 2 (PREMIUM ONLY)', value: 'theme2', disabled: isDisabled },
  ]
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAddTranslation, setIsOpenAddTranslation] = useState(false);
  const [fieldData, setFieldData] = useState("");

  const refSelectMultile = useRef(null);
  useOutsideAlerter(refSelectMultile, () => setIsOpen(false));

  const handleOpenSelectMultile = () => {
    setIsOpen(!isOpen);
  };

  const handleOpenAddTranslation = (data) => {
    setFieldData(data);
    setIsOpenAddTranslation(true);
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
       Please message us for free assistance matching the FAQ page with your theme!
      </Banner>
      </div>
      <Card title="FAQ Page">
        <Card.Section>
          <FormLayout>
            <CustomField label="FAQ Groups">
              <div ref={refSelectMultile} onClick={handleOpenSelectMultile}>
                <SelectMutileValueSortElement
                  isOpen={isOpen}
                  formik={formik}
                  keys="groups"
                  keyChild="groups"
                  data={groups}
                />
              </div>
            </CustomField>
            <Select
              name="theme"
              id="theme"
              value={formik.values.theme}
              label="Theme"
              onChange={handleChange}
              options={optionsSelectThemes}
              helpText={(
                <TextStyle variation="subdued">You can see all the demo <Link external url="https://simesy-faq.myshopify.com/pages/demo-faq-page">here</Link> (password: shopify)</TextStyle>
              )}
            />
            {formik.values.theme === optionsSelectThemes[1]?.value &&
              <CustomColorPicker
                title="Icon Color"
                nameKey="iconColor"
                handleChangeSetColor={handleChangeSetColor}
                backgroundColorBackUp={formik.values.iconColor}
                handleOpenSetColor={handleOpenSetColor}
                colorPagination={colorPagination}
                backgroundColor={dataBackUp.iconColor}
              />
            }

            {formik.values.theme === optionsSelectThemes[2]?.value &&
              <div style={{ paddingTop: '1rem' }}>
                <FormLayout>
                  <Select name="linklistStyle"
                    id="linklistStyle"
                    value={formik.values.linklistStyle}
                    label="Navigation item style"
                    onChange={handleChange} options={optionNavigationStyle} />

                  <CustomColorPicker
                    title="Navigation item color"
                    nameKey="linklistColor"
                    handleChangeSetColor={handleChangeSetColor}
                    backgroundColorBackUp={formik.values.linklistColor}
                    handleOpenSetColor={handleOpenSetColor}
                    colorPagination={colorPagination}
                    backgroundColor={dataBackUp.linklistColor}
                  />

                  <CustomColorPicker
                    title="Navigation item active/hover color"
                    nameKey="linklistActiveColor"
                    handleChangeSetColor={handleChangeSetColor}
                    backgroundColorBackUp={formik.values.linklistActiveColor}
                    handleOpenSetColor={handleOpenSetColor}
                    colorPagination={colorPagination}
                    backgroundColor={dataBackUp.linklistActiveColor}
                  />
                </FormLayout>
              </div>
            }

            <CustomColorPicker
              title="Header background color"
              nameKey="headerBackgroundColor"
              handleChangeSetColor={handleChangeSetColor}
              backgroundColorBackUp={formik.values.headerBackgroundColor}
              // description="Set image box-shadow color."
              handleOpenSetColor={handleOpenSetColor}
              colorPagination={colorPagination}
              backgroundColor={dataBackUp.headerBackgroundColor}
            />
            <TextField
              id="headerHeight"
              name="headerHeight"
              label="Header height"
              value={formik.values.headerHeight}
              type="number"
              onChange={handleChange}
            />
            <Checkbox
              id="showPageTitle"
              name="showPageTitle"
              checked={formik.values.showPageTitle}
              label="Show page title"
              onChange={handleChange}
            />
            {formik?.values?.showPageTitle && (
              <div>
                <TextField
                  id="pageTitle"
                  name="pageTitle"
                  label="Page title"
                  value={formik.values.pageTitle}
                  onChange={handleChange}
                />
                <div className="btn-add-translation">
                  <Button
                    onClick={() => {
                      handleOpenAddTranslation({
                        title: "Page title",
                        name: "pageTitle",
                        value: formik.values.pageTitle,
                      });
                    }}
                    plain
                    icon={LanguageMinor}
                  >
                    Add Translation
                  </Button>
                </div>
              </div>
            )}

            <TextField
              id="pageTitleSize"
              name="pageTitleSize"
              label="Page title size"
              type="number"
              value={formik.values.pageTitleSize}
              onChange={handleChange}
            />
            <CustomColorPicker
              title="Page title color"
              nameKey="pageTitleColor"
              handleChangeSetColor={handleChangeSetColor}
              backgroundColorBackUp={formik.values.pageTitleColor}
              // description="Set image box-shadow color."
              handleOpenSetColor={handleOpenSetColor}
              colorPagination={colorPagination}
              backgroundColor={dataBackUp.pageTitleColor}
            />
            <Checkbox
              id="showPageIntro"
              name="showPageIntro"
              checked={formik.values.showPageIntro}
              label="Show page intro"
              onChange={handleChange}
            />
            {formik?.values?.showPageIntro && (
              <div>
                <TextField
                  id="pageIntro"
                  name="pageIntro"
                  label="Page intro"
                  value={formik.values.pageIntro}
                  onChange={handleChange}
                />
                <div className="btn-add-translation">
                  <Button
                    onClick={() => {
                      handleOpenAddTranslation({
                        title: "Page intro",
                        name: "pageIntro",
                        value: formik.values.pageIntro,
                      });
                    }}
                    plain
                    icon={LanguageMinor}
                  >
                    Add Translation
                  </Button>
                </div>
              </div>
            )}
            <TextField
              id="pageIntroSize"
              name="pageIntroSize"
              label="Page intro size"
              type="number"
              value={formik.values.pageIntroSize}
              onChange={handleChange}
            />
            <CustomColorPicker
              title="Page intro color"
              nameKey="pageIntroColor"
              handleChangeSetColor={handleChangeSetColor}
              backgroundColorBackUp={formik.values.pageIntroColor}
              // description="Set image box-shadow color."
              handleOpenSetColor={handleOpenSetColor}
              colorPagination={colorPagination}
              backgroundColor={dataBackUp.pageIntroColor}
            />
            <Checkbox
              id="showSearchBox"
              name="showSearchBox"
              checked={formik.values.showSearchBox}
              label="Show search box"
              onChange={handleChange}
            />
            {formik?.values?.showSearchBox && (
              <div>
                <TextField
                  id="searchPlaceholder"
                  name="searchPlaceholder"
                  label="Search placeholder"
                  value={formik.values.searchPlaceholder}
                  onChange={handleChange}
                />
                <div className="btn-add-translation">
                  <Button
                    onClick={() => {
                      handleOpenAddTranslation({
                        title: "Search placeholder",
                        name: "searchPlaceholder",
                        value: formik.values.searchPlaceholder,
                      });
                    }}
                    plain
                    icon={LanguageMinor}
                  >
                    Add Translation
                  </Button>
                </div>
              </div>
            )}
            {formik?.values?.showSearchBox && (
              <div>
                <TextField
                  id="searchNotFoundText"
                  name="searchNotFoundText"
                  label="Search not found text"
                  value={formik.values.searchNotFoundText}
                  onChange={handleChange}
                />
                <div className="btn-add-translation">
                  <Button
                    onClick={() => {
                      handleOpenAddTranslation({
                        title: "Search not found text",
                        name: "searchNotFoundText",
                        value: formik.values.searchNotFoundText,
                      });
                    }}
                    plain
                    icon={LanguageMinor}
                  >
                    Add Translation
                  </Button>
                </div>
              </div>
            )}
            <TextField
              id="groupNameSize"
              name="groupNameSize"
              label="Group name size"
              type="number"
              value={formik.values.groupNameSize}
              onChange={handleChange}
            />
            <CustomColorPicker
              title="Group name color"
              nameKey="groupNameColor"
              handleChangeSetColor={handleChangeSetColor}
              backgroundColorBackUp={formik.values.groupNameColor}
              // description="Set image box-shadow color."
              handleOpenSetColor={handleOpenSetColor}
              colorPagination={colorPagination}
              backgroundColor={dataBackUp.groupNameColor}
            />
          </FormLayout>
        </Card.Section>
      </Card>
      <Card title="FAQ Style">
        <Card.Section>
          <FormLayout>
            <ChoiceList
              title="FAQ Style"
              id="faqStyleID"
              name="faqStyleID"
              choices={optionFonStyle(isDisabled)}
              selected={formik.values.faqStyleID}
              onChange={handleChange}
            />
          </FormLayout>
        </Card.Section>
      </Card>
      {(formik?.values?.faqStyleID?.includes("custom") || isDisabled) && (
        <Card title={
          <div>
            <h2 className="Polaris-Heading">Custom Style</h2> {isDisabled && <div style={{ marginTop: "0.8rem" }}><UpgradePlan /></div>}
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
      {isOpenAddTranslation && (
        <ModalAddTranslations
          plan={plan}
          locales={locales}
          localeOptions={localeOptions}
          data={fieldData}
          onSubmit={handleAddTranslation}
          visible={true}
          onCancel={() => {
            setIsOpenAddTranslation(false);
            setFieldData("");
          }}
          shop={shop}
          transitionsSetting={transitionsSetting}
        />
      )}
    </>
  );
}
