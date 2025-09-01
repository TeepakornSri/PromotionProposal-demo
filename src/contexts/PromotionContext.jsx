import { createContext, useEffect, useState, useCallback } from 'react';
import axios from '../config/axios';

export const PromotionContext = createContext();

export default function PromotionContextProvider({ children }) {
  const [promotion, setPromotion] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [promotionDetails, setPromotionDetails] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [rowData2, setRowData2] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPromotionDetails = useCallback((documentNumber) => {
    setIsLoading(true);
    axios
      .get(`/PromotionProposal/api/promotion/getpromotiondetail/${documentNumber}`)
      .then((response) => {
        const data = response.data.data;

        if (data) {
          setRowData(data.promotionDetails)
          setRowData2(data.promotionDetails)
          setPromotion(data);
          setCustomer(data.customer);
          setPromotionDetails(data.promotionDetails);
          setProposals(data.proposals);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch promotion data", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <PromotionContext.Provider value={{ rowData,rowData2,promotion, customer, promotionDetails, proposals, isLoading, fetchPromotionDetails }}>
      {children}
    </PromotionContext.Provider>
  );
}
