import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import TextInput from "../ui_elements/TextInput/TextInput.jsx";
import PhoneInput from "../ui_elements/PhoneInput/PhoneInput.jsx";
import Button from "../ui_elements/Button/Button.jsx";
import Spinner from "../ui_elements/Spinner/Spinner.jsx";
import style from "./PhoneList.module.scss";
import ContactItem from "../ContactItem/ContactItem.jsx";
import cn from "classnames";
import Cookies from "js-cookie";

const Host = import.meta.env.VITE_HOST;

export default function PhoneList() {
  const [contacts, setContacts] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const {
    reset,
    getValues,
    formState: { isValid },
  } = form;

  const getAll = async (loading) => {
    if (loading) setLoadingAll(true);

    const data = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("phonebook_token")}`,
      },
    };

    try {
      const response = await fetch(`http://${Host}/api/v1.0/contacts`, data);
      const result = await response.json();
      setContacts(result);
      setLoadingAll(false);
    } catch (err) {
      setLoadingAll(false);
      console.log("Error:", err);
    }
  };

  const addContact = async () => {
    setLoadingAdd(true);
    setLoadingAll(true);
    const raw = JSON.stringify({
      name: getValues("name"),
      phone: getValues("phone"),
    });

    const data = {
      method: "POST",
      body: raw,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("phonebook_token")}`,
      },
    };
    try {
      const response = await fetch(`http://${Host}/api/v1.0/contacts`, data);
      if (response.status === 201) {
        getAll(true);
        setLoadingAdd(false);
      }
    } catch (err) {
      setLoadingAdd(false);
      console.log("Error:", err);
    } finally {
      reset();
    }
  };

  useEffect(() => {
    getAll(true);
  }, []);

  return (
    <div className={style.mainContainer}>
      <h4>Список контактов</h4>
      <div
        className={cn(style.contactsWrapper, {
          [style.veil]: loadingAll && contacts.length !== 0,
        })}
      >
        {loadingAll && contacts.length === 0 && (
          <div className={style.skeleton}>
            <Spinner size={32} />
          </div>
        )}
        {loadingAll && contacts.length !== 0 && (
          <div className={style.spinnerWrapper}>
            <Spinner size={32} />
          </div>
        )}
        {contacts.map((contact) => {
          return (
            <div className={style.contactContainer} key={contact.id}>
              <ContactItem contact={contact} getAll={() => getAll()} />
            </div>
          );
        })}
      </div>

      <div className={style.addFormContainer}>
        <FormProvider {...form}>
          <form
            className={style.fieldsContainer}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (isValid || !loadingAdd || !loadingAll)) {
                addContact();
              }
            }}
          >
            <TextInput name="name" required label="Имя *" disabled={loadingAll || loadingAdd} />
            <PhoneInput name="phone" required label="Номер телефона *" disabled={loadingAll || loadingAdd} />
          </form>
        </FormProvider>

        <Button
          disabled={!isValid || loadingAdd || loadingAll}
          loading={loadingAdd}
          type="primary"
          text={"Добавить"}
          onClick={addContact}
        />
      </div>
    </div>
  );
}
