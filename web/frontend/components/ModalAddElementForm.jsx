import { Modal, OptionList } from "@shopify/polaris";
import { useEffect } from "react";
import { optionChooseElementForm } from "../constants";

export default function ModalAddElementForm({ formik, handleOpenAddField }) {
  const [selectedFields, setSelectedFields] = React.useState(
    formik.values.form_elements
  );

  useEffect(() => {
    formik.handleChange({
      target: { id: "form_elements", value: selectedFields },
    });
  }, [selectedFields]);

  return (
    <Modal open={true} onClose={handleOpenAddField} title="Form Fields">
      <OptionList
        onChange={setSelectedFields}
        options={optionChooseElementForm}
        selected={selectedFields}
        allowMultiple
      />
    </Modal>
  );
}
