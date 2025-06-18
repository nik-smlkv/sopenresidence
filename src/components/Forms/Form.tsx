import "./style.scss";

import Input from "./Input/Input.tsx";
import { config, type FormDataI, initialState } from "./Input/config.ts";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FormButton from "../Buttons/FormButton.tsx";
import { useLang } from "../../hooks/useLang.ts";

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

function Form({ ...enabled }: TypeInputEnabled) {
  const [formValue, setFormValue] = useState<FormDataI>(initialState);
  const [errors, setErrors] = useState<FormDataI>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<View>(View.void);
  const { t } = useLang();
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof FormDataI;
    const value = e.target.value;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (view === View.done) {
      const timer = setTimeout(() => {
        setView(View.void);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [view]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      fields: {
        TITLE:
          "Complete CRM form 'Prijava za konsultacije sa sajta (sopenpark.rs)'",
        NAME: formValue.username?.trim() || "",
        PHONE: [{ VALUE: formValue.phone?.trim() || "", VALUE_TYPE: "WORK" }],
        EMAIL: [{ VALUE: formValue.email?.trim() || "", VALUE_TYPE: "WORK" }],
      },
      params: { REGISTER_SONET_EVENT: "Y" },
    };

    try {
      const response = await fetch(
        "https://crm.bktesla.rs/rest/1/gt107jhf1wp8901m/crm.lead.add.json",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

      const result = await response.json();
      console.log("Успешно отправлено:", result);

      setView(View.done);
      setFormValue(initialState);
      setErrors(initialState);
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      setErrors({
        email: " ",
        username: " ",
        phone: "",
      });
    } finally {
      setIsLoading(false);
    }
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
            <div
              className={`content__personal ${isLoading ? "Loading" : "Great"}`}
            >
              <p className="text__personal">
                {t.t_personal}
                <Link
                  to={{
                    pathname: "/",
                  }}
                  className="link__personal"
                >
                  {t.t_personal_data}
                </Link>
              </p>
              <FormButton />
            </div>
          </div>
        </form>
      )}
    </>
  );
}

export default Form;
