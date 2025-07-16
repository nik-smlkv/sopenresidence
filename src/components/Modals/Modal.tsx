import React, { useEffect, useState } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else {
      const timeout = setTimeout(() => {
        setIsMounted(false);
      }, 500); 
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.open : styles.close}`}
      onClick={onClose}
    >
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
