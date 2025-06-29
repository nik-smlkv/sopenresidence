import Header from "../components/Header/Header"
import SectionMain from "../components/Main/SectionMain.tsx/SectionMain"
import styles from "./HomePage.module.css"
const HomePage = () => {
  return (
  <>
    <Header/>
    <main className={styles.main}>
      <SectionMain/>
    </main>
  </>
  )
}

export default HomePage