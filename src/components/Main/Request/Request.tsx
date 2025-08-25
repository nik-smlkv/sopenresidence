import { useLang } from "../../../hooks/useLang";
import Form from "../../Forms/Form";
import styles from "./Request.module.css";
const Request = () => {
  const { t } = useLang();
  return (
    <div className={styles.form__body}>
      <h2 className={styles.form__title}>{t.t_form_title}</h2>
      <div className={styles.form__content}>
        <Form username={"name"} phone={"phone"} email={"email"} />
      </div>
    </div>
  );
};

export default Request;
