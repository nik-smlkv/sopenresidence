import { Link } from "react-router-dom";
import Form from "../components/Forms/Form";
import styles from "./MaintenancePage.module.css";

const MaintenancePage = () => {
  return (
    <main>
      <div className={styles.maintanceHeader}>
        <img className={styles.logo} src="/logo.svg" alt="logo" />
        <div className={styles.langSwitcher}>
          <span>en</span>/<span>srb</span>
        </div>
      </div>
      <div className={styles.maintanceContent}>
        <div className={styles.formMaintance}>
          <div className={styles.titleContent}>
            <h1 className={styles.title}>
              We’re currently improving our website.
            </h1>
            <p className={styles.subtitle}>
              Full functionality will be restored soon.
            </p>
          </div>
          <p className={styles.description}>
            In the meantime, please fill out the form below, and we’ll get back
            to you shortly.
          </p>
          <Form username={"name"} phone={"phone"} email={"email"} />
          <div className={styles.contactBlock}>
            <div>
              <p className={styles.contactName}>Phone</p>
              <Link
                to="tel:0800/012-025"
                className={styles.contact}
              >
                0800/012-025
              </Link>
            </div>
            <div>
              <p className={styles.contactName}>Sales department</p>
              <Link
                to="mailto:prodaja@sopenpark.rs"
                className={styles.contact}
              >
                prodaja@sopenpark.rs
              </Link>
            </div>
          </div>
        </div>
        <img
          className={styles.image}
          src="../src/assets/images/maintance-image.jpg"
          alt="Techwork Image"
        />
      </div>
    </main>
  );
};

export default MaintenancePage;
