import { Button, Icon } from "@shopify/polaris";
import {
  CirclePlusOutlineMinor,
  EditMinor,
  MobileCancelMajor,
} from "@shopify/polaris-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import FaqItem from "./FaqItem";
import ModalConfirmDelete from "./ModalConfirmDelete";

function FaqGroup({
  group,
  idEditAddNew,
  deleteGroup,
  handleEditGroup,
  formik,
  handleOpenAddFaq,
  idEditFaqGroup,
  faqItem,
  editFaq,
  deleteFaq,
  handleUpRow,
  handleDownRow,
  handleOpenEditGroup,
  handleOpenEditFaq,
  isReachLimit
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [faq, setFaq] = useState([]);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const isGroupSelected = useMemo(() => idEditFaqGroup === group.id, [
    group,
    idEditFaqGroup,
  ]);

  // const onChange = () => {
  //   handleEditGroup({
  //     id: group?.id,
  //     name: groupName,
  //     faq,
  //     checked: !group.checked,
  //   });
  // };

  useEffect(() => {
    if (idEditAddNew === group?.id) {
      setIsEdit(true);
    }
    return () => {
      setIsEdit(false);
    };
  }, [idEditAddNew]);

  useEffect(() => {
    if (group.name) {
      setGroupName(group?.name);
    }
    if (group.faqs) {
      setFaq(group?.faqs);
    }
  }, [group?.name, group?.faq]);

  const onCancleEditGroup = useCallback(() => {
    if (idEditAddNew === group?.id) {
      deleteGroup(group?.id, formik.values.groups);
    }
    setIsEdit(false);
    setGroupName(group?.name);
  }, [isEdit, formik.values.groups]);

  const handleChangeValueNameGroup = (value) => {
    setGroupName(value);
  };

  const handleSaveGroup = useCallback(async () => {
    const data = await handleEditGroup({
      id: group?.id,
      name: groupName,
      faq,
    });
    if (data) {
      setIsEdit(false);
    }
  }, [groupName, group, faq]);

  const handleDeleteGroup = useCallback(() => {
    deleteGroup(group?.id, formik.values.groups);
  }, [formik.values.groups, group?.id]);

  const handleConfirmDelete = useCallback(() => {
    setIsConfirmDelete(true);
  }, [isConfirmDelete]);

  return (
    <div className="faq-group">
      <div className="group-header">
        <div>{group?.name}</div>
        <div className="group-header-action">
          <div
            onClick={() => handleOpenEditGroup(group)}
            className="cursor-pointer"
          >
            <Icon source={EditMinor} />
          </div>
          <div onClick={handleConfirmDelete} className="cursor-pointer">
            <Icon source={MobileCancelMajor} />
          </div>
        </div>
      </div>
      {
        <div className="group-content">
          <div className="group-list-faq">
            {group?.faqs?.map((item, index) => (
              <React.Fragment key={item?.id}>
                <FaqItem
                  formik={formik}
                  groupId={group?.id}
                  editFaq={editFaq}
                  isGroupSelected={isGroupSelected}
                  faqItem={faqItem}
                  item={item}
                  deleteFaq={deleteFaq}
                  handleUpRow={handleUpRow}
                  handleDownRow={handleDownRow}
                  handleOpenEditFaq={handleOpenEditFaq}
                />
              </React.Fragment>
            ))}
          </div>

          <div className="btn-add-faq">
            <Button
              onClick={() => handleOpenAddFaq(group.id)}
              plain
              icon={CirclePlusOutlineMinor}
              disabled={isReachLimit}
            >
              Add New FAQ
            </Button>
          </div>
        </div>
      }
      {isConfirmDelete && (
        <ModalConfirmDelete
          title="Confirm Delete"
          groupName={group?.name}
          setOpen={setIsConfirmDelete}
          handleDelete={handleDeleteGroup}
        />
      )}
    </div>
  );
}

export default FaqGroup;
