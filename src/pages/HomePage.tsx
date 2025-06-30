import Header from "../components/Header/Header";
import AboutMain from "../components/Main/AboutMain/AboutMain";
import Infrastructura from "../components/Main/Infrastructure/Infrastructure";
import SectionMain from "../components/Main/SectionMain/SectionMain";
import styles from "./HomePage.module.css";
const HomePage = () => {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <SectionMain />
        <img
          className={styles.video_stab}
          src="../../../public/images/video-stab.jpg"
          alt=""
        />
        <AboutMain />
        <Infrastructura />
      </main>
    </>
  );
};

export default HomePage;
