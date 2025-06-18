import { type InputProps } from "./Input";

type Config = (InputProps & {
  validate?: (error: FormDataI) => string;
  name: keyof FormDataI;
})[];

export const config: Config = [
  {
    name: "username",
    placeholder: "t_name",
    required: false,
    type: "text",
    validate: (error: FormDataI) => (error.username ? error.username : ""),
  },
  {
    name: "email",
    placeholder: "t_email",
    type: "email",
    required: false,
    validate: (error: FormDataI) => (error.email ? error.email : ""),
  },
  {
    name: "phone",
    placeholder: "t_phone",
    type: "phone",
    required: false,
    validate: (error: FormDataI) => (error.phone ? error.phone : ""),
  },
];

export const initialState: FormDataI = {
  username: "",
  email: "",
  phone: "",
};

export type FormDataI = {
  username: string;
  email: string;
  phone: string;
};
