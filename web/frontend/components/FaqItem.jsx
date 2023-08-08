import { Card, Collapsible, Icon } from "@shopify/polaris";
import {
  ChevronDownMinor,
  ChevronUpMinor,
  EditMinor,
  MobileCancelMajor,
} from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import ModalConfirmDelete from "./ModalConfirmDelete";

function FaqItem({
  item,
  isGroupSelected,
  faqItem,
  editFaq,
  groupId,
  formik,
  deleteFaq,
  handleUpRow,
  handleDownRow,
  handleOpenEditFaq,
}) {
  const [open, setOpen] = useState(false);
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  useEffect(() => {
    if (isGroupSelected && faqItem === item?.id && !isEdit && !isAddNewOpen) {
      setIsEdit(true);
      setIsAddNewOpen(true);
    }
  }, [isGroupSelected, isEdit, faqItem, item?.id, isAddNewOpen]);

  useEffect(() => {
    setIsEdit(false);
  }, []);

  const handleToggle = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const handleDeleteFaq = useCallback(() => {
    deleteFaq({ faqId: item?.id, groupId });
  }, [item, groupId]);

  const handleConfirmDelete = useCallback(() => {
    setIsConfirmDelete(!isConfirmDelete);
  }, [isConfirmDelete]);

  return (
    <>
      <Card>
        <Card.Section>
          <div className="faq-item">
            <div className="item-header">
              <div
                ariaExpanded={open}
                aria-controls="basic-collapsible"
                // onClick={handleToggle}
                className="item-name"
              >
                {item?.question}
              </div>
              <div className="group-header-action">
                {/* <Switch
                    uncheckedIcon={false}
                    onColor="#008060"
                    checkedIcon={false}
                    checked={item?.checked}
                    onChange={handleChangeSwitch}
                    height={20}
                    width={40}
                  /> */}
                <div
                  className="cursor-pointer icon-down"
                  onClick={() => handleUpRow({ groupId, faqId: item?.id })}
                >
                  <Icon source={ChevronUpMinor} />
                </div>
                <div
                  className="cursor-pointer icon-down"
                  onClick={() => handleDownRow({ groupId, faqId: item?.id })}
                >
                  <Icon source={ChevronDownMinor} />
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => handleOpenEditFaq(item, groupId)}
                >
                  <Icon source={EditMinor} />
                </div>
                <div onClick={handleConfirmDelete} className="cursor-pointer">
                  <Icon source={MobileCancelMajor} />
                </div>
              </div>
            </div>

            <Collapsible
              open={open}
              id="basic-collapsible"
              transition={{
                duration: "250ms",
                timingFunction: "ease-in-out",
              }}
              expandOnPrint
            >
              <div className="item-answer">{item?.answer}</div>
            </Collapsible>
          </div>
        </Card.Section>
      </Card>
      {isConfirmDelete && (
        <ModalConfirmDelete
          title="Confirm Delete"
          setOpen={setIsConfirmDelete}
          handleDelete={handleDeleteFaq}
        />
      )}
    </>
  );
}

export default FaqItem;
