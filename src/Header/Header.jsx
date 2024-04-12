import React, { useState, useEffect } from "react";
import Button from "../ui_elements/Button/Button.jsx";
import style from "./Header.module.scss";
import Cookies from "js-cookie";
import { useAuthStore } from "../store/authStore";

const Host = import.meta.env.VITE_HOST;

export default function Header() {
  const [user, setUser] = useState(null);
  const { isAuth, setIsAuth } = useAuthStore();

  const logout = () => {
    Cookies.remove("phonebook_token");
    setIsAuth(false);
  };

  const getUser = async () => {
    const data = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("phonebook_token")}`,
      },
    };

    try {
      const response = await fetch(`http://${Host}/api/v1.0/user`, data);
      const result = await response.json();
      setUser(result);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    if (isAuth) {
      getUser();
    }
  }, [isAuth]);

  return (
    <header className={style.header}>
      <p className={style.headerTitle}>{`Пользователь: ${isAuth && user ? user.userName : ""}`}</p>
      <div className={style.buttonWrapper}>
        <Button text="Выход" onClick={logout} disabled={!isAuth} />
      </div>
    </header>
  );
}
