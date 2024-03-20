import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import cn from "classnames";
import style from "./TextInput.module.scss";

export default function TextInput({ label, name, required = false, disabled, editingMode = false }) {
  const { register, control } = useFormContext();

  return (
    <>
      <label className={style.label}>{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <input
            {...register(name, { required })}
            className={cn(style.main, {
              [style.editingMode]: editingMode,
            })}
            value={value}
            onChange={onChange}
            disabled={disabled}
            autoFocus={true}
          />
        )}
      />
    </>
  );
}
