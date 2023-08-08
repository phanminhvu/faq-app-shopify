import { Card, Checkbox, FormLayout } from "@shopify/polaris";
import React from "react";

export default function SettingsTabLeft({
  formik,
  handleChange,
  errorMessage,
}) {
  return (
    <Card>
      <Card.Section title="Activate">
        <Checkbox
          id="activate"
          name="activate"
          checked={formik.values.activate}
          onChange={handleChange}
        />
      </Card.Section>
      <Card.Section title="Show all FAQs on different pages">
        <Checkbox
          id="showAllFaqs"
          name="showAllFaqs"
          checked={formik.values.showAllFaqs}
          onChange={handleChange}
        />
      </Card.Section>
      <Card.Section title="Show only certain FAQs on different pages of store">
        <Checkbox
          id="showOnlyCertainFaqs"
          name="showOnlyCertainFaqs"
          checked={formik.values.showOnlyCertainFaqs}
          onChange={handleChange}
        />
      </Card.Section>
      <Card.Section title="Show FAQs on checkout success page">
        <Checkbox
          id="showFaqsCheckoutSuccess"
          name="showFaqsCheckoutSuccess"
          checked={formik.values.showFaqsCheckoutSuccess}
          onChange={handleChange}
        />
      </Card.Section>
    </Card>
  );
}
