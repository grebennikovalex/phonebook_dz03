import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import Cookies from "js-cookie";
import style from "./LogInForm.module.scss";
import TextInput from "../ui_elements/TextInput/TextInput.jsx";
import Button from "../ui_elements/Button/Button.jsx";
import Alert from "../ui_elements/Alert/Alert.jsx";
import NewUserPrompt from "../NewUserPrompt/NewUserPrompt.jsx";

const Host = import.meta.env.VITE_HOST;

export default function LogInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openPrompt, setOpenPrompt] = useState(false);
  const [unknownUser, setUnknownUser] = useState(null);
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
      } else {
        if (response.status === 401) {
          setError("Неправильное имя пользователя или пароль");
        } else if (response.status === 404) {
          const result = await response.json();
          setUnknownUser(result);
          setOpenPrompt(true);
        } else {
          setError("Неизвестная ошибка...");
        }
      }
    } catch (err) {
      setLoading(false);
      console.log("Error:", err);
      setError(err);
    } finally {
      reset();
      setLoading(false);
    }
  };

  return (
    <>
      <NewUserPrompt
        userName={unknownUser?.userName}
        password={unknownUser?.password}
        open={openPrompt}
        close={setOpenPrompt}
      />
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
            <TextInput name="userName" required label="Пользователь *" autoFocus={true} />
            <TextInput name="password" required label="Пароль *" type="password" />
            {error && <Alert text={error} />}
          </div>
          <Button disabled={!isValid || loading} loading={loading} type="primary" text={"Войти"} onClick={login} />
        </form>
      </FormProvider>
    </>
  );
}
