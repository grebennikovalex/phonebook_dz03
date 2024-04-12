import React, { useState } from "react";
import style from "./NewUserPrompt.module.scss";
import { useAuthStore } from "../store/authStore";
import Modal from "../ui_elements/Modal/Modal";
import Cookies from "js-cookie";

const Host = import.meta.env.VITE_HOST;

export default function NewUserPrompt({ userName, password, open, close }) {
  const { setIsAuth } = useAuthStore();
  const [loading, setLoading] = useState();
  const createUser = async () => {
    setLoading(true);
    const data = {
      method: "POST",
      body: JSON.stringify({
        userName,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(`http://${Host}/api/v1.0/user`, data);
      if (response.status === 200) {
        const result = await response.json();
        Cookies.set("phonebook_token", result.token, { expires: 7 });
        close();
        setLoading(false);
        setIsAuth(true);
      }
    } catch (err) {
      setLoading(false);
      console.log("Error:", err);
    }
  };

  return (
    <Modal open={open} close={() => close()} action={() => createUser()} loading={loading}>
      <div className={style.modalContainer}>
        <p>Пользователя с таким именем не существует...</p>
        <p>{`Создать ${userName}?`}</p>
      </div>
    </Modal>
  );
}
