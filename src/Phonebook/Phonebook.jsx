import React, { useEffect } from "react";
import PhoneList from "../PhoneList/PhoneList";
import LogInForm from "../LogInForm/LogInForm";
import Header from "../Header/Header";
import Cookies from "js-cookie";
import { useAuthStore } from "../store/authStore";

export default function Phonebook() {
  const { isAuth, setIsAuth } = useAuthStore();

  useEffect(() => {
    if (Cookies.get("phonebook_token")) {
      setIsAuth(true);
    } else setIsAuth(false);
  }, [setIsAuth]);

  return (
    <div>
      <Header />
      {isAuth ? <PhoneList /> : <LogInForm />}
    </div>
  );
}
