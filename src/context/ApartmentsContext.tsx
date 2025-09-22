import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchExcelFromPublic, type Apartment } from "../utils/utils";

interface ApartmentsContextType {
  apartments: Apartment[];
  loading: boolean;
  error: string | null;
  getByFloor: (floor: number) => Apartment[];
}

const ApartmentsContext = createContext<ApartmentsContextType>({
  apartments: [],
  loading: true,
  error: null,
  getByFloor: () => [],
});

export const useApartments = () => useContext(ApartmentsContext);

export const ApartmentsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExcelFromPublic()
      .then((data) => {
        setApartments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });
  }, []);

  const getByFloor = (floor: number) =>
    apartments.filter((apt) => apt.floor === floor);

  return (
    <ApartmentsContext.Provider
      value={{ apartments, loading, error, getByFloor }}
    >
      {children}
    </ApartmentsContext.Provider>
  );
};
