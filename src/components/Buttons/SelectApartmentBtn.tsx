

import styles from "./Button.module.css"
const SelectApartmentBtn = () => {
  return (
    <button className={`apart__btn ${styles.apartment__btn}`}><span>Select an apartment</span></button>
  )
}

export default SelectApartmentBtn;