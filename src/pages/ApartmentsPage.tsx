import ApartmentsFilter from "../components/ApartmentsFilter/ApartmentsFilter";
import Breadcrumbs from "../components/Breadcrumbs/Breadcrumbs";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import Request from "../components/Main/Request/Request";
import styles from "./Apartments.module.css";
const ApartmentsPage = () => {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.intro_section}>
          <div className={styles.intro_section_container}>
            <Breadcrumbs />
            <div className={styles.intro_title_block}>
              <h1 className={styles.intro_title}>Apartments</h1>
              <p className={styles.apart_info_txt}>(326 options)</p>
            </div>
          </div>
        </section>
        <ApartmentsFilter />
        <Request />
      </main>
      <Footer />
    </>
  );
};

export default ApartmentsPage;
