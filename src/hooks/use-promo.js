import { useContext } from "react";
import { PromotionContext } from '../contexts/PromotionContext'

export function usePromo() {
  return useContext(PromotionContext);
}
