type Props = {
  onClick?: () => void;
};

import styles from "./Button.module.css";
const SelectApartmentBtn: React.FC<Props> = ({ onClick }) => {
  return (
    <button className={`apart__btn ${styles.apartment__btn}`} onClick={onClick}>
      <span>Select an apartment</span>
    </button>
  );
};

export default SelectApartmentBtn;
