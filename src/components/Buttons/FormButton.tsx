import styles from "./Button.module.css";
const FormButton = ({ disabled }: { disabled: boolean }) => {

  return (
    <button className={styles.button__circle} disabled={disabled}>
      <svg
        className={styles.button__arrow}
        width="34"
        height="28"
        viewBox="0 0 34 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 14H32M32 14L19 1M32 14L19 27"
          stroke="#FAF7F2"
          stroke-width="1.5"
        />
      </svg>
    </button>
  );
};

export default FormButton;
