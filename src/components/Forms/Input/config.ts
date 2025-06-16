import { InputProps } from "./Input";

type Config = (InputProps & {
  validate?: (error: FormDataI) => string;
  name: keyof FormDataI;
})[];

export const config: Config = [
  {
    name: "username",
    placeholder: "Имя",
    required: false,
    type: "text",
    validate: (error: FormDataI) => (error.username ? error.username : ""),
  },
  {
    name: "email",
    placeholder: "E-mail",
    type: "email",
    required: false,
    validate: (error: FormDataI) => (error.email ? error.email : ""),
  },
  {
    name: "textarea",
    placeholder: "Комментарии",
    type: "textarea",
    required: false,
    validate: (error: FormDataI) => (error.textarea ? error.textarea : ""),
  },
];

export const initialState: FormDataI = {
  username: "",
  email: "",
  textarea: "",
};

export type FormDataI = {
  username: string;
  email: string;
  textarea: string;
};
