import { useEffect, useState } from "react";
import ApartmentsFilter from "../components/ApartmentsFilter/ApartmentsFilter";
import Breadcrumbs from "../components/Breadcrumbs/Breadcrumbs";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import Request from "../components/Main/Request/Request";
import styles from "./Apartments.module.css";
import { fetchExcelFromPublic, type Apartment } from "../utils";
import { useLang } from "../hooks/useLang";
const ApartmentsPage = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLang();
  useEffect(() => {
    fetchExcelFromPublic()
      .then(setApartments)
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      });
  }, []);
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section
          className={styles.intro_section}
          data-section-id="transparent-black"
        >
          <div className={styles.intro_section_container}>
            <Breadcrumbs />
            <div className={styles.intro_title_block}>
              <h1 className={styles.intro_title}>{t.t_apart_title}</h1>
              <p className={styles.apart_info_txt}>
                ({apartments.length} {t.t_apart_txt})
              </p>
            </div>
          </div>
        </section>

        {error ? (
          <div className={styles.error_block}>Error: {error}</div>
        ) : (
          <ApartmentsFilter apartments={apartments} />
        )}
        <Request />
      </main>
      <Footer />
    </>
  );
};

export default ApartmentsPage;
