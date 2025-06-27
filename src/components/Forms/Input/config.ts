import { type InputProps } from "./Input";

type Config = (InputProps & {
  validate?: (value: string) => string;
  filtered: (value: string) => string;
  name: keyof FormDataI;
})[];

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

const validateSerbianPhone = (phone: string): string => {
  const regex = /^\+?\d+$/;
  console.log(phone);
  if (!phone.trim()) return "Broj telefona je obavezan";
  if (!regex.test(phone)) return "Neispravan format broja iz Srbije";
  return "";
};
const validateName = (name: string): string => {
  const regex = /^[A-Za-zА-Яа-яЁёЉЊЂЃҐЌЏŠŽČĆĐšžčćđјљњћўїєіё\s\-]+$/u;

  if (!name.trim()) return "Ime je obavezno";
  if (!regex.test(name))
    return "Dozvoljena su samo slova (latinična ili ćirilična)";
  return "";
};

const validateEmail = (email: string): string => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email.trim()) return "Email je obavezan";
  if (!regex.test(email)) return "Neispravan format email adrese";
  return "";
};

export const filterPhoneInput = (value: string): string => {
  let filtered = value.replace(/[^\d+]/g, "");
  if (filtered.includes("+")) {
    filtered = "+" + filtered.replace(/\+/g, "");
  }
  return filtered;
};

export const config: Config = [
  {
    name: "username",
    placeholder: "t_name",
    required: false,
    type: "text",
    validate: validateName,
    filtered: (val: string) => val,
  },
  {
    name: "email",
    placeholder: "t_email",
    type: "email",
    required: false,
    validate: validateEmail,
    filtered: (val: string) => val,
  },
  {
    name: "phone",
    placeholder: "t_phone",
    type: "phone",
    required: false,
    validate: validateSerbianPhone,
    filtered: filterPhoneInput,
  },
];
