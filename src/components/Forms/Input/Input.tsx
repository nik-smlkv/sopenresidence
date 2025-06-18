import { type JSX } from "react";
import "../style.scss";
import { useLang } from "../../../hooks/useLang";
export type InputProps = {
  errorMessage?: string;
  error?: boolean;
  placeholder?: string;
} & JSX.IntrinsicElements["input"];

const Input = (props: InputProps) => {
  const { placeholder, errorMessage, error = false, type, ...rest } = props;
  type TKeys = keyof typeof t;
  const { t } = useLang();

  const placeholderKey: TKeys = placeholder as TKeys;

  return (
    <label className="input_container">
      <input
        className="input"
        autoComplete="off"
        data-error={error}
        type={type || "text"}
        {...rest}
      />
      <p className="input_error" data-error={error}>
        {errorMessage}
      </p>
      <p className="input_placeholder">{placeholderKey && t[placeholderKey]}</p>
    </label>
  );
};

export default Input;
