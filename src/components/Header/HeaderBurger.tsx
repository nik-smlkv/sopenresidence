import styles from "./Header.module.css";
import { useModal } from "../../hooks/useModal";
import Modal from "../Modals/Modal";
import BurgerModal from "../Modals/BurgerModal";

const HeaderBurger = () => {
  const burgerModal = useModal();

  const handleToggle = () => {
    burgerModal.isOpen ? burgerModal.close() : burgerModal.open();
  };

  return (
    <>
      <div
        className={`${styles.header__burger} ${burgerModal.isOpen ? styles.active : ""}`}
        onClick={handleToggle}
      >
        <span className={styles.burger_line}></span>
        <span className={styles.burger_line}></span>
        <span className={styles.burger_line}></span>
      </div>

      <Modal isOpen={burgerModal.isOpen} onClose={burgerModal.close}>
        <BurgerModal />
      </Modal>
    </>
  );
};

export default HeaderBurger;
