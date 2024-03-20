import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FormProvider, useForm } from "react-hook-form";
import TextInput from "../ui_elements/TextInput/TextInput";
import PhoneInput from "../ui_elements/PhoneInput/PhoneInput";
import Button from "../ui_elements/Button/Button";
import Spinner from "../ui_elements/Spinner/Spinner";
import style from "./Phonebook.module.scss";
import { isEmpty } from "../utils/utils.js";
import ContactItem from "../ContactItem/ContactItem.jsx";
import cn from "classnames";

export default function Phonebook() {
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
    setValue,
    getValues,
    formState: { isValid },
  } = form;

  const getAll = async () => {
    setLoadingAll(true);
    const data = {
      method: "GET",
    };
    try {
      const response = await fetch(`http://109.71.240.150:3001/api/v1.0/contacts`, data);
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
      id: uuidv4(),
      name: getValues("name"),
      phone: getValues("phone"),
    });

    const data = {
      method: "POST",
      body: raw,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(`http://109.71.240.150:3001/api/v1.0/contacts`, data);
      if (response.status === 201) {
        getAll();
        setLoadingAdd(false);
      }
    } catch (err) {
      setLoadingAdd(false);
      console.log("Error:", err);
    } finally {
      setValue("name", "");
      setValue("phone", "");
    }
  };

  useEffect(() => {
    getAll();
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
              if (event.keyCode === 13) {
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
