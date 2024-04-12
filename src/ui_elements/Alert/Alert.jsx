import React from "react";
import style from "./Alert.module.scss";

export default function Alert({ text }) {
  return (
    <div className={style.container}>
      <p>{text}</p>
    </div>
  );
}
