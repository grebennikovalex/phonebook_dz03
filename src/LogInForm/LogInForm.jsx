import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import Cookies from "js-cookie";
import style from "./LogInForm.module.scss";
import TextInput from "../ui_elements/TextInput/TextInput.jsx";
import Button from "../ui_elements/Button/Button.jsx";

const Host = import.meta.env.VITE_HOST;

export default function LogInForm() {
  const [loading, setLoading] = useState(false);
  const { setIsAuth } = useAuthStore();
  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const {
    getValues,
    reset,
    formState: { isValid },
  } = form;

  const login = async () => {
    setLoading(true);

    const raw = JSON.stringify({
      userName: getValues("userName"),
      password: getValues("password"),
    });

    const data = {
      method: "POST",
      body: raw,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(`http://${Host}/api/v1.0/login`, data);
      if (response.status === 200) {
        const result = await response.json();
        Cookies.set("phonebook_token", result.token, { expires: 7 });
        setIsAuth(true);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log("Error:", err);
    } finally {
      reset();
      setLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className={style.formContainer}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (isValid || !loading)) {
            login();
          }
        }}
      >
        <div className={style.fieldsWrapper}>
          <TextInput name="userName" required label="Пользователь *" />
          <TextInput name="password" required label="Пароль *" type="password" />
        </div>
        <Button disabled={!isValid || loading} loading={loading} type="primary" text={"Войти"} onClick={login} />
      </form>
    </FormProvider>
  );
}
