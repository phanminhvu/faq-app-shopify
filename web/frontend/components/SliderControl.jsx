import {
  Card,
  Checkbox,
  ChoiceList,
  FormLayout,
  Icon,
  Select,
  TextField,
  TextStyle,
} from "@shopify/polaris";
import React from "react";
import {
  DEPEN_NAVIGATION,
  OFF_ON_MOBILE,
  OptionIconBorderRadius,
  optionIconStyle,
  optionNavigation,
  OptionNavigationType,
  optionPositon,
  optionSlideDirection,
  optionSlideMode,
  OptionSliderAnimation,
  OptionSliderAutoPlay,
  STANDARD,
  TRUE,
} from "../constants";
import CustomField from "./CustomField";
import CustomFieldResponsive from "./CustomFieldResponesive";
import CustomFieldBorder from "./CustomFieldBorder";
import { RiDragMove2Fill } from "react-icons/ri";
import CustomFieldPadding from "./CustomFieldPadding";

export default function SliderControl({
  formik,
  handleChange,
  colorPagination,
  handleChangeColorAddToCart,
  handleOpenSetColor,
  dataBackUp,
}) {
  return (
    <Card title="Slider">
      <Card.Section>
        <FormLayout>
          {/* {!formik.values.thumbnail_slider && (
            <CustomField
              helpText="Set a slider mode. Slider Settings are disabled in the ticker mode. "
              label="Slider Mode"
            >
              <ChoiceList
                id="slider_mode"
                name="slider_mode"
                choices={optionSlideMode()}
                selected={formik?.values?.slider_mode}
                onChange={handleChange}
              />
            </CustomField>
          )} */}
          {formik?.values?.slider_mode?.includes(STANDARD) && (
            <div>
              <CustomField helpText="AutoPlay" label="Autoplay">
                <ChoiceList
                  id="slider_auto_play"
                  name="slider_auto_play"
                  choices={OptionSliderAutoPlay}
                  selected={formik?.values?.slider_auto_play}
                  onChange={handleChange}
                />
              </CustomField>
            </div>
          )}{" "}
          {(formik.values.slider_auto_play.includes(TRUE) ||
            formik.values.slider_auto_play.includes(OFF_ON_MOBILE)) &&
            formik?.values?.slider_mode?.includes(STANDARD) && (
              <div style={{ marginTop: "15px" }}>
                <CustomField
                  label="AutoPlay Speed"
                  helpText="Set auto play speed in a millisecond. Default value 3000ms."
                >
                  <TextField
                    id="slider_auto_play_speed"
                    name="slider_auto_play_speed"
                    type="number"
                    value={formik.values.slider_auto_play_speed}
                    onChange={handleChange}
                  />
                </CustomField>
              </div>
            )}
          <CustomField
            label="Navigation Type"
            helpText="Select navigation type."
          >
            <Select
              id="navigation_type"
              name="navigation_type"
              options={OptionNavigationType}
              value={formik.values.navigation_type}
              onChange={handleChange}
            />
          </CustomField>
          <TextField
            label="Slides to Show"
            type="number"
            id="columns"
            handleChange={handleChange}
            value={formik.values.columns}
          />
          <TextField
            label="Slides To Scroll"
            type="number"
            id="slide_to_scroll"
            handleChange={handleChange}
            value={formik.values.slide_to_scroll}
          />
          {/* <CustomField
            label="Pagination Speed"
            helpText="Set pagination speed in a millisecond. Default value 600ms."
          >
            <TextField
              id="slider_scroll_speed"
              name="slider_scroll_speed"
              type="number"
              value={formik.values.slider_scroll_speed}
              onChange={handleChange}
            />
          </CustomField>
          <div>
            {formik?.values?.slider_mode?.includes(STANDARD) &&
              !formik?.values?.thumbnail_slider && (
                <CustomFieldResponsive
                  label="Slides To Scroll"
                  helpText="Number of testimonial(s) to scroll at a time."
                  id="slide_to_scroll"
                  handleChange={handleChange}
                  values={formik.values.slide_to_scroll}
                />
              )}
          </div>
          <div>
            {formik?.values?.slider_mode?.includes(STANDARD) &&
              !formik?.values?.thumbnail_slider && (
                <CustomFieldResponsive
                  label="Row"
                  helpText="Set number of row in different devices for responsive view."
                  id="slider_row"
                  handleChange={handleChange}
                  values={formik.values.slider_row}
                />
              )}
          </div>
          <CustomField
            isFlex
            label="Pause on Hover"
            helpText="On/Off slider pause on hover."
          >
            <Checkbox
              id="slider_pause_on_hover"
              name="slider_pause_on_hover"
              checked={formik.values.slider_pause_on_hover}
              onChange={handleChange}
            />
          </CustomField>
          {!formik?.values?.thumbnail_slider && (
            <div>
              <CustomField
                isFlex
                label="Infinite Loop"
                helpText="On/Off infinite loop mode."
              >
                <Checkbox
                  id="slider_infinite"
                  name="slider_infinite"
                  checked={formik.values.slider_infinite}
                  onChange={handleChange}
                />
              </CustomField>
            </div>
          )}
          {formik?.values?.slider_mode?.includes(STANDARD) && (
            <div style={{ marginTop: "15px" }}>
              <CustomField
                label="Slider Animation"
                helpText="Fade effect works only on single column view."
              >
                <ChoiceList
                  id="slider_animation"
                  name="slider_animation"
                  choices={OptionSliderAnimation()}
                  selected={formik?.values?.slider_animation}
                  onChange={handleChange}
                />
              </CustomField>
            </div>
          )}
          <div style={{ marginTop: "15px" }}>
            <CustomField label="Direction" helpText="Slider direction.">
              <ChoiceList
                id="slider_direction"
                name="slider_direction"
                choices={optionSlideDirection}
                selected={formik?.values?.slider_direction}
                onChange={handleChange}
              />
            </CustomField>
          </div>
          {formik?.values?.slider_mode?.includes(STANDARD) && (
            <>
              <div style={{ paddingTop: "1.6rem" }}>
                <FormLayout>
                  <TextStyle variation="strong">Navigation</TextStyle>
                  <CustomField
                    label="Navigation"
                    helpText="Show/Hide navigation arrow."
                  >
                    <ChoiceList
                      id="navigation"
                      name="navigation"
                      choices={optionNavigation}
                      selected={formik?.values?.navigation}
                      onChange={handleChange}
                    />
                  </CustomField>
                  {DEPEN_NAVIGATION.includes(
                    formik?.values?.navigation
                      .toString()
                      .replaceAll("/[]/g", "")
                  ) && (
                    <CustomField
                      label="Select Position"
                      helpText="Select a position for the navigation arrows."
                    >
                      <Select
                        id="navigation_position"
                        name="navigation_position"
                        options={optionPositon}
                        value={formik?.values?.navigation_position}
                        onChange={handleChange}
                      />
                    </CustomField>
                  )}
                  {DEPEN_NAVIGATION.includes(
                    formik?.values?.navigation
                      .toString()
                      .replaceAll("/[]/g", "")
                  ) && (
                    <CustomField
                      label="Choose an Icon"
                      helpText="Choose an slider navigation icon."
                    >
                      <div className="choice-list">
                        <ChoiceList
                          id="navigation_icons"
                          name="navigation_icons"
                          choices={optionIconStyle}
                          selected={formik?.values?.navigation_icons}
                          onChange={handleChange}
                        />
                      </div>
                    </CustomField>
                  )}
                  {DEPEN_NAVIGATION.includes(
                    formik?.values?.navigation
                      .toString()
                      .replaceAll("/[]/g", "")
                  ) && (
                    <CustomField
                      label="Navigation Icon Size"
                      helpText="Change navigation icon size."
                    >
                      <TextField
                        id="navigation_icon_size"
                        name="navigation_icon_size"
                        type="number"
                        value={formik.values.navigation_icon_size}
                        onChange={handleChange}
                      />
                    </CustomField>
                  )}
                  {DEPEN_NAVIGATION.includes(
                    formik?.values?.navigation
                      .toString()
                      .replaceAll("/[]/g", "")
                  ) && (
                    <CustomFieldBorder
                      isBorderStyle={false}
                      isHoverColor={true}
                      isBackGroundColor={true}
                      value={formik?.values?.navigation_color}
                      dataBackups={dataBackUp?.navigation_color}
                      id="navigation_color"
                      handleChange={handleChange}
                      colorPagination={colorPagination}
                      handleChangeColorAddToCart={handleChangeColorAddToCart}
                      label="Pagination Color"
                      helpText="Set color for pagination."
                      handleOpenSetColor={handleOpenSetColor}
                    />
                  )}
                  {DEPEN_NAVIGATION.includes(
                    formik?.values?.navigation
                      .toString()
                      .replaceAll("/[]/g", "")
                  ) && (
                    <CustomFieldBorder
                      isHoverColor={true}
                      value={formik?.values?.navigation_border}
                      dataBackups={dataBackUp?.navigation_border}
                      id="navigation_border"
                      handleChange={handleChange}
                      colorPagination={colorPagination}
                      handleChangeColorAddToCart={handleChangeColorAddToCart}
                      label="Navigation Border"
                      helpText="Set the navigation border."
                      handleOpenSetColor={handleOpenSetColor}
                    />
                  )}
                  {DEPEN_NAVIGATION.includes(
                    formik?.values?.navigation
                      .toString()
                      .replaceAll("/[]/g", "")
                  ) && (
                    <CustomField
                      label="Icon Border Radius"
                      helpText="Set the navigation border radius."
                    >
                      <div style={{ display: "flex" }}>
                        <TextField
                          type="number"
                          value={formik?.values?.navigation_border_radius?.all}
                          id="navigation_border_radius['all']"
                          name="navigation_border_radius['all']"
                          onChange={handleChange}
                          prefix={
                            <div style={{ marginTop: "6px" }}>
                              <Icon source={RiDragMove2Fill} color="base" />
                            </div>
                          }
                        />
                        <div style={{ marginLeft: "10px" }}>
                          <Select
                            id="navigation_border_radius['unit']"
                            name="navigation_border_radius['unit']"
                            options={OptionIconBorderRadius}
                            value={
                              formik?.values?.navigation_border_radius?.unit
                            }
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </CustomField>
                  )}
                </FormLayout>
              </div>
              <div style={{ paddingTop: "1.6rem" }}>
                <FormLayout>
                  <TextStyle variation="strong">Pagination</TextStyle>
                  <CustomField
                    label="Pagination"
                    helpText="Show/Hide pagination."
                  >
                    <ChoiceList
                      id="pagination"
                      name="pagination"
                      choices={optionNavigation}
                      selected={formik?.values?.pagination}
                      onChange={handleChange}
                    />
                  </CustomField>
                  {DEPEN_NAVIGATION.includes(
                    formik?.values?.pagination
                      .toString()
                      .replaceAll("/[]/g", "")
                  ) && (
                    <CustomFieldPadding
                      label="Margin"
                      helpText="Set pagination margin."
                      values={formik.values.pagination_margin}
                      id="pagination_margin"
                      handleChange={handleChange}
                    />
                  )}
                  {DEPEN_NAVIGATION.includes(
                    formik?.values?.pagination
                      .toString()
                      .replaceAll("/[]/g", "")
                  ) && (
                    <CustomFieldBorder
                      isBorderStyle={false}
                      isSpaceBetween={false}
                      isActiveColor={true}
                      value={formik?.values?.pagination_colors}
                      dataBackups={dataBackUp?.pagination_colors}
                      id="pagination_colors"
                      handleChange={handleChange}
                      colorPagination={colorPagination}
                      handleChangeColorAddToCart={handleChangeColorAddToCart}
                      label="Pagination Color"
                      helpText="Set the pagination color."
                      handleOpenSetColor={handleOpenSetColor}
                    />
                  )}
                </FormLayout>
              </div>
              <div style={{ paddingTop: "1.6rem" }}>
                <FormLayout>
                  <TextStyle variation="strong">Miscellaneous</TextStyle>
                  <CustomField
                    isFlex
                    label="Adaptive Slider Height"
                    helpText="Dynamically adjust slider height based on each slide\'s height."
                  >
                    <Checkbox
                      id="adaptive_height"
                      name="adaptive_height"
                      checked={formik.values.adaptive_height}
                      onChange={handleChange}
                    />
                  </CustomField>
                  <CustomField
                    isFlex
                    label="Touch Swipe"
                    helpText="On/Off swipe mode."
                  >
                    <Checkbox
                      id="slider_swipe"
                      name="slider_swipe"
                      checked={formik.values.slider_swipe}
                      onChange={handleChange}
                    />
                  </CustomField>
                  {formik.values.slider_swipe && (
                    <CustomField
                      isFlex
                      label="Mouse Draggable"
                      helpText="On/Off mouse draggable mode."
                    >
                      <Checkbox
                        id="slider_draggable"
                        name="slider_draggable"
                        checked={formik.values.slider_draggable}
                        onChange={handleChange}
                      />
                    </CustomField>
                  )}
                  {formik.values.slider_swipe && (
                    <CustomField
                      isFlex
                      label="Swipe To Slide"
                      helpText="On/Off swipe to slide."
                    >
                      <Checkbox
                        id="swipe_to_slide"
                        name="swipe_to_slide"
                        checked={formik.values.swipe_to_slide}
                        onChange={handleChange}
                      />
                    </CustomField>
                  )}
                </FormLayout>
              </div>
            </>
          )} */}
        </FormLayout>
      </Card.Section>
    </Card>
  );
}
