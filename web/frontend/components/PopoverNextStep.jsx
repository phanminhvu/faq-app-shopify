import React, { useState, useCallback } from "react";
import { Popover, ActionList, Button } from "@shopify/polaris";
import {
  MobileHamburgerMajor,
  ToolsMajor,
  ColorsMajor,
  ThemeEditMajor,
  CodeMajor,
  CheckoutMajor,
  ViewMajor,
  HomeMajor,
  ProductsMajor,
  CirclePlusMajor,
  PaintBrushMajor
} from "@shopify/polaris-icons";

export default function PopoverNextStep(props) {
  const { fullWidth, close, faqPageSetting, hideAddMore } = props;
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const actionList = [
    {
      "content": "Add more FAQs",
      icon: CirclePlusMajor,
      onAction: close
    },
    {
      "content": "Add FAQs to product page",
      icon: ProductsMajor,
      url: "https://simesy-agency.freshdesk.com/support/solutions/articles/73000596141-how-to-add-faqs-to-product-page-",
      external: true
    },
    {
      "content": "Add FAQ page to store navigation",
      icon: MobileHamburgerMajor,
      url: "https://simesy-agency.freshdesk.com/support/solutions/articles/73000598082-how-to-add-faq-page-to-store-navigation-",
      external: true
    },
    {
      "content": "Add FAQs to homepage",
      icon: HomeMajor,
      url: "https://simesy-agency.freshdesk.com/support/solutions/articles/73000598083-how-to-add-faqs-to-homepage-",
      external: true,
    },
    {
      "content": "Customize FAQ page",
      icon: PaintBrushMajor,
      onAction: faqPageSetting,
    },
    // {
    //   content: "Update FAQ page SEO meta fields",
    //   icon: ToolsMajor,
    // },
    // {
    //   content: "Customize FAQs size & colors.",
    //   icon: ColorsMajor,
    // },
    // {
    //   content: "Embed FAQs on other parts of store.",
    //   icon: ThemeEditMajor,
    // },
    // {
    //   content: "Add CSS styling to match brand.",
    //   icon: CodeMajor,
    // },
    // {
    //   content: "Show FAQs on checkout success page.",
    //   icon: CheckoutMajor,
    // },
    {
      content: "View all support articles.",
      icon: ViewMajor,
      url: "https://simesy-agency.freshdesk.com/support/solutions/73000298154",
      external: true
    },
  ];

  const activator = (
    <Button fullWidth={fullWidth} onClick={togglePopoverActive} disclosure>
      Most frequent next step by a merchant
    </Button>
  );

  return (
    <div className="popover-next-step">
      <Popover
        fullWidth
        active={popoverActive}
        activator={activator}
        onClose={togglePopoverActive}
      >
        <ActionList items={hideAddMore ? actionList.slice(1) : actionList} onActionAnyItem={close} />
      </Popover>
    </div>
  );
}
