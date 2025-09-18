import React from "react";
import styles from "./FloorPlan.module.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { useParams } from "react-router-dom";
const FloorPlan = () => {
  const { floorId } = useParams();

  const floor = parseInt(floorId || "0", 10);

  return (
    <>
      <Header />
      <main>
        <section className={styles.floor_plan} data-section-id="light">
          <div className={styles.plan_info_content}>
            <button className={styles.grid_view_btn}>
              <span>Grid view</span>
            </button>
            <h2 className={styles.floor_title}>Floor {floor}</h2>
          </div>
          <div className={styles.floor_info_block}>
            <div className={styles.floor_list_block}>
              <span>Floor</span>
              <div className={styles.floor_list}>
                <span></span>
                <ul>
                  <li></li>
                </ul>
                <span></span>
              </div>
            </div>
            <div className={styles.section_block}>
              <div className={styles.section_content}>
                <span>Lamela</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default FloorPlan;
