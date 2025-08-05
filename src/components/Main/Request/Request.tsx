
import Form from "../../Forms/Form";
import styles from "./Request.module.css";
const Request = () => {
  return (
    <div className={styles.form__body}>
      <h2 className={styles.form__title}>Request a call</h2>
      <div className={styles.form__content}>
        <Form username={"name"} phone={"phone"} email={"email"} />
      </div>
    </div>
  );
};

export default Request;
