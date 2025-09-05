import React, { useEffect, useState } from "react";
import { fetchExcelFromPublic, type Apartment } from "../../utils";
import styles from "./ApartmentsFilter.module.css";
const ApartmentsFilter: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExcelFromPublic()
      .then(setApartments)
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Произошла неизвестная ошибка");
        }
      });
  }, []);

  if (error) return <div>Ошибка: {error}</div>;
  if (apartments.length === 0) return <div>Загрузка...</div>;

  return (
    <section className={styles.apartament__filter}>
      <div className={styles.list}>
        <ul>
          {apartments.map((apt) => (
            <li className={styles.apart__card}>
              <div className={styles.apart__card_content}>
                <div className={styles.apart__card_info}>
                  <p className={styles.info_name}>{apt.id}</p>
                  <div className="">
                    <p className={styles.info_area}>{apt.area} m²</p>{" "}
                    <p className={styles.info_floor}>{apt.floor} floor</p>
                  </div>
                </div>
                <img src="" alt="" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ApartmentsFilter;
