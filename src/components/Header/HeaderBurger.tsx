import styles from "./Header.module.css";
import Modal from "../Modals/Modal";
import BurgerModal from "../Modals/BurgerModal";
type HeaderBurgerProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

const HeaderBurger: React.FC<HeaderBurgerProps> = ({
  isOpen,
  onToggle,
  onClose,
}) => {
  return (
    <>
      <div
        className={`${styles.header__burger} ${isOpen ? styles.active : ""}`}
        onClick={onToggle}
      >
        <span className={styles.burger_line}></span>
        <span className={styles.burger_line}></span>
        <span className={styles.burger_line}></span>
      </div>
      <div className={styles.modal__wrapper}>
        <Modal isOpen={isOpen} onClose={onClose}>
          <BurgerModal />
        </Modal>
      </div>
    </>
  );
};

export default HeaderBurger;
