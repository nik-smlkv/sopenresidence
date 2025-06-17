import "./style.scss";

import Input from "./Input/Input.tsx";
import { config, type FormDataI, initialState } from "./Input/config.ts";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import FormButton from "../Buttons/FormButton.tsx";

const View = {
  void: "void",
  done: "done",
} as const;
type View = (typeof View)[keyof typeof View];

type TypeInputEnabled = {
  username?: string;
  phone?: string;
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
        phone: "",
      });
      return;
    }
    setView(View.done);
  };

  return (
    <>
      {view === View.void && (
        <form className="form" onSubmit={onSubmit}>
          <div className="form_container">
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
            <div className="content__personal">
              <p className="text__personal">
                By clicking the button, you agree to terms of processing
                <Link
                  to={{
                    pathname: "/",
                  }}
                  className="link__personal"
                >
                  personal data
                </Link>
              </p>
            </div>
            {/* <button className="form_button">
            {isLoading ? "Loading" : "Great"}
          </button> */}
          </div>
          <FormButton />
        </form>
      )}
    </>
  );
}

export default Form;
