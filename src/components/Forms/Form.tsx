import "./style.scss";

import Input from "./Input/Input.tsx";
import type { config, FormDataI, initialState } from "./Input/config.ts";
import type { ChangeEvent, FormEvent, useState } from "react";

enum  View {
  void = "void",
  done = "done",
}
type TypeInputEnabled = {
  username?: string;
  textarea?: string;
  email?: string;
};
const wait = () =>
  new Promise((res) => {
    setTimeout(res, 1000);
  });

function Form({ ...enabled }: TypeInputEnabled) {
  const [formValue, setFormValue] = useState<FormDataI>(initialState);
  const [errors, setErrors] = useState<FormDataI>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<View>(View.void);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof FormDataI;
    const value = e.target.value;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isWrong = true;
    setIsLoading(true);
    await wait();
    setIsLoading(false);
    if (isWrong) {
      setErrors({
        email: " ",
        username: " ",
        textarea: "",
      });
      return;
    }
    setView(View.done);
  };

  return (
    <>
      {view === View.void && (
        <form className="form_container" onSubmit={onSubmit}>
          <p className="form_title">Оставьте заявку</p>
          <p className="input_error" data-error={!!errors.username}>
            Wrong email or name
          </p>
          {config.map((item) => {
            const { validate, name, ...rest } = item;
            const errorMessage = validate?.(errors);
            return Object.keys(enabled).map((enableItem) => {
              if (enableItem === name) {
                return (
                  <Input
                    key={name}
                    autoFocus={!!errorMessage && name === "email"}
                    onChange={onChange}
                    name={name}
                    value={formValue[name]}
                    error={!!errorMessage}
                    errorMessage={errorMessage}
                    {...rest}
                  />
                );
              }
            });
          })}
          <button className="form_button">
            {isLoading ? "Loading" : "Great"}
          </button>
        </form>
      )}
    </>
  );
}

export default Form;
