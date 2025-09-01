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
          <Breadcrumbs />
        </section>
        <ApartmentsFilter />
        <Request />
      </main>
      <Footer />
    </>
  );
};

export default ApartmentsPage;
