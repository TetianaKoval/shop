import { useContext } from "react";
import { CartContext } from "./СartContext";

export const useCart = () => useContext(CartContext);