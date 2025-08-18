type Props = {
  onClick?: () => void;
};

import { useLang } from "../../hooks/useLang";
import styles from "./Button.module.css";
const SelectApartmentBtn: React.FC<Props> = ({ onClick }) => {
  const {t} = useLang();
  return (
    <button className={`apart__btn ${styles.apartment__btn}`} onClick={onClick}>
      <span>{t.t_apart}</span>
    </button>
  );
};

export default SelectApartmentBtn;
