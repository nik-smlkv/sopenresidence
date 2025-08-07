import { Link } from "react-router-dom";
import Form from "../components/Forms/Form";
import styles from "./MaintenancePage.module.css";
import Header from "../components/Header/Header";
import { useLang } from "../hooks/useLang";

const MaintenancePage = () => {
  const { t, lang } = useLang();
  return (
    <>
      <Header />
      <main>
        <div className={styles.maintanceContent}>
          <div className={styles.formMaintance}>
            <div className={styles.formBody}>
              <div className={styles.titleContent}>
                <h1 className={lang == "en" ? styles.title : styles.titleSr}>{t.t_improve}</h1>
                <p className={styles.subtitle}>{t.t_restore}</p>
              </div>
              <p className={styles.description}>{t.t_meantime}</p>
              <Form username={"name"} phone={"phone"} email={"email"} />
            </div>

            <div className={styles.contactBlock}>
              <div>
                <p className={styles.contactName}>{t.t_phone}</p>
                <Link to="tel:0800/012-025" className={styles.contact}>
                  0800/012-025
                </Link>
              </div>
              <div>
                <p className={styles.contactName}>{t.t_depart}</p>
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
            src="./images/maintance-image.jpg"
            alt="Techwork Image"
          />
        </div>
      </main>
    </>
  );
};

export default MaintenancePage;
