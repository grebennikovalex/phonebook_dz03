import React, { useState } from "react";
import cn from "classnames";
import Spinner from "../ui_elements/Spinner/Spinner";
import style from "./DeleteButton.module.scss";
import Modal from "../ui_elements/Modal/Modal";

export default function DeleteButton({ id, name, getAll }) {
  const [loading, setLoading] = useState(false);
  const [openPrompt, setOpenPrompt] = useState(false);

  const deleteContact = async () => {
    setLoading(true);
    const data = {
      method: "DELETE",
    };
    try {
      const response = await fetch(`http://109.71.240.150:3001/api/v1.0/contacts/${id}`, data);
      if (response.status === 204) {
        getAll(false);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log("Error:", err);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpenPrompt(true)}
        disabled={loading}
        className={cn(style.button, {
          [style.disabled]: loading,
        })}
      >
        {loading ? (
          <div>
            <Spinner size={18} />
          </div>
        ) : (
          <p style={{ rotate: "45deg" }}>+</p>
        )}
      </button>
      <Modal open={openPrompt} close={() => setOpenPrompt(false)} action={() => deleteContact()}>
        <div style={{ fontSize: "18px" }}>{`Удалить контакт ${name}?`}</div>
      </Modal>
    </>
  );
}
