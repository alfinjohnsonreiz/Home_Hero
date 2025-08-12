import  { createContext,  useState, type ReactNode } from "react";

type ModalContextType = {
  isServiceReqOpen: boolean;
  openServiceReqModal: () => void;
  closeServiceReqModal: () => void;
};
export const ServiceReqContext = createContext<ModalContextType | undefined>(
  undefined
);
const ServiceReqProvider = ({ children }: { children: ReactNode }) => {
  const [isServiceReqOpen, setServiceReqOpen] = useState(false);
  const openServiceReqModal = () => setServiceReqOpen(true);
  const closeServiceReqModal = () => setServiceReqOpen(false);
  return (
    <>
      <ServiceReqContext.Provider
        value={{ isServiceReqOpen, openServiceReqModal, closeServiceReqModal }}
      >
        {children}
      </ServiceReqContext.Provider>
    </>
  );
};

export default ServiceReqProvider;
