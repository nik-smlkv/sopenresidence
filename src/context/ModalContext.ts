import { createContext, useContext } from "react";

const ModalContext = createContext({ close: () => {} });

export const useModalControl = () => useContext(ModalContext);

export default ModalContext;
