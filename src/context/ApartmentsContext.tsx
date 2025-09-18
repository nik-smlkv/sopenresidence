import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchExcelFromPublic, type Apartment } from "../utils/utils";

interface ApartmentsContextType {
  apartments: Apartment[];
  loading: boolean;
  error: string | null;
}

const ApartmentsContext = createContext<ApartmentsContextType>({
  apartments: [],
  loading: true,
  error: null,
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

  return (
    <ApartmentsContext.Provider value={{ apartments, loading, error }}>
      {children}
    </ApartmentsContext.Provider>
  );
};
