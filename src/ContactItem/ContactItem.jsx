import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import cn from "classnames";
import TextInput from "../ui_elements/TextInput/TextInput";
import PhoneInput from "../ui_elements/PhoneInput/PhoneInput";
import DeleteButton from "../DeleteButton/DeleteButton.jsx";
import OkButton from "../OkButton/OkButton.jsx";
import style from "./ContactItem.module.scss";
import Cookies from "js-cookie";

const Host = import.meta.env.VITE_HOST;

export default function ContactItem({ contact, getAll }) {
  const [loading, setLoading] = useState(false);
  const [editingMode, setEditingMode] = useState(false);

  const { name, phone, id } = contact;

  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const {
    setValue,
    getValues,
    formState: { isValid },
  } = form;

  const editContact = async () => {
    setLoading(true);
    setEditingMode(false);
    const values = getValues();
    const { name, phone } = values;
    const raw = JSON.stringify({ id, name, phone });
    const data = {
      method: "PATCH",
      body: raw,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("phonebook_token")}`,
      },
    };
    try {
      const response = await fetch(`http://${Host}/api/v1.0/contacts/${id}`, data);
      if (response.status === 200) {
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
      {editingMode ? (
        <FormProvider {...form}>
          <form
            className={style.form}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isValid) {
                editContact();
              }
            }}
          >
            <div className={style.editItem}>
              <TextInput name="name" required label="" disabled={false} editingMode={true} autoFocus={true} />
              <PhoneInput name="phone" required label="" disabled={false} editingMode={true} />
            </div>
            <OkButton onClick={() => editContact()} disabled={!isValid || loading} loading={loading} />
          </form>
        </FormProvider>
      ) : (
        <>
          <div className={style.contactItem}>
            <p>{name}</p>
            <p>{phone}</p>
          </div>
          <button
            onClick={() => {
              setEditingMode(true);
              setValue("name", name);
              setValue("phone", phone);
            }}
            disabled={loading}
            className={cn(style.button, {
              [style.disabled]: loading,
            })}
          >
            изменить
          </button>
          <DeleteButton id={id} name={name} getAll={() => getAll()} />
        </>
      )}
    </>
  );
}
