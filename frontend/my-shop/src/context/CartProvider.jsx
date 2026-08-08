import { useState } from "react";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (productId) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(product => product.productId === productId);

      if (existingProduct) {
        return prevCart.map(item => 
          productId === item.productId
            ? {...item, quantity: item.quantity + 1}
            : item
        )
      } else {
        return [
          ...prevCart,
          {
            productId: productId,
            quantity: 1,
          }
        ]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      return prevCart.filter(item => item.productId !== productId)
    })
  }

  const updateQuantity = (productId, newQantity) => {
    setCart(prevCart => {
      return prevCart.map(item =>
        item.productId === productId
          ? {...item, quantity: newQantity}
          : item
      )
    })
  } 

  return (
    <CartContext.Provider value={{cart, setCart, addToCart, removeFromCart, updateQuantity}} >
      {children}
    </CartContext.Provider>
  )
}
