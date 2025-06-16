import styles from "./MaintenancePage.module.css";

const MaintenancePage = () => {
  return (
    <>
      <div className={styles.maintanceHeader}>
        <img className={styles.logo} src="../public/logo.svg" alt="logo" />
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
          <div className={styles.contactBlock}>
            <div >
              <p className={styles.contactName}>Phone</p>
              <p className={styles.contact}>0800/012-025</p>
            </div>
            <div >
              <p className={styles.contactName}>Sales department</p>
              <p className={styles.contact}>prodaja@sopenpark.rs</p>
            </div>
          </div>
        </div>
        <img
          className={styles.image}
          src="../src/assets/images/maintance-image.jpg"
          alt="Techwork Image"
        />
      </div>
    </>
  );
};

export default MaintenancePage;
