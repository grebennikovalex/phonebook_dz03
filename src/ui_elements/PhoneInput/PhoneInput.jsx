import React from "react";
import { InputMask } from "@react-input/mask";
import { Controller, useFormContext } from "react-hook-form";
import cn from "classnames";
import style from "./PhoneInput.module.scss";

const regexForPhone = /^(\+7|7|8)?[\s\-]?\([0-9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/gm;

export default function PhoneInput({ label, name, required = false, disabled, editingMode = false }) {
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
            value: regexForPhone,
            message: "Некорректный номер",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <InputMask
            placeholder="+7 "
            mask="+7 (___) ___-__-__"
            replacement={{ _: /\d/ }}
            {...register(name, { required })}
            className={cn(style.main, {
              [style.editingMode]: editingMode,
            })}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        )}
      />
    </>
  );
}
