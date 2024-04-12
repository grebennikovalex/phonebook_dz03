import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import cn from "classnames";
import style from "./TextInput.module.scss";

const regexSpaces = /^([a-zA-Z0-9а-яА-Я]+\s)*[a-zA-Zа-яА-Я0-9]+$/;

export default function TextInput({
  label,
  name,
  required = false,
  disabled,
  editingMode = false,
  type = "text",
  autoFocus = false,
}) {
  const { register, control } = useFormContext();

  return (
    <>
      <label className={style.label}>{label}</label>
      <Controller
        control={control}
        name={name}
        rules={{
          required,
          pattern: {
            value: regexSpaces,
            message: "Некорректное имя",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <input
            {...register(name, { required })}
            className={cn(style.main, {
              [style.editingMode]: editingMode,
            })}
            value={value}
            onChange={onChange}
            disabled={disabled}
            autoFocus={autoFocus}
            type={type}
          />
        )}
      />
    </>
  );
}
