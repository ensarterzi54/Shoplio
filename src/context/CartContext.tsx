import React, { createContext, useState, useContext, useEffect } from 'react'
import { CardItem } from '../models'

interface CartContextType {
  isCartOpen: boolean
  toggleCart: () => void
  closeCart: () => void
  total: number | null
  setTotal: React.Dispatch<React.SetStateAction<number | null>>
  totalAmount: number
  setTotalAmount: React.Dispatch<React.SetStateAction<number>>
  cartItems: CardItem[]
  setCartItems: React.Dispatch<React.SetStateAction<CardItem[]>>
  order: () => void
  getTotalAmount: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [total, setTotal] = useState<number | null>(null)
    const [totalAmount, setTotalAmount] = useState<number>(0)
    const [cartItems, setCartItems] = useState<CardItem[]>([])

    const toggleCart = () => setIsCartOpen(prev => !prev)
    const closeCart = () => setIsCartOpen(false)

    useEffect(() => {
        fetch('https://localhost:7164/Cart/Index')
            .then(res => res.json())
            .then(data => {
                console.log("asdad")
                console.log(data)
                setCartItems(data)
            })
    }, []);

    const order = () => {
        fetch('https://localhost:7164/api/order?email=ali@gmail.com', { method: "POST" })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    console.log("Siparişler:", data);
                    console.log("Sipariş adedi:", data.length);
                    fetch('https://localhost:7164/Cart/Index')
                        .then(res => res.json())
                        .then(data => {
                        console.log("asdad")
                        console.log(data)
                        setCartItems(data)
                        setTotal(0)
                        setTotalAmount(0)
                        getTotalAmount()
                    })
                } else {
                    console.error("Beklenmeyen veri formatı:", data);
                }
            });
    }

    const getTotalAmount = () => {
        const email = "ali@gmail.com"; // Kullanıcı emailini buradan alın
        fetch(`https://localhost:7164/api/cart?email=${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(data => {
            // Use cart data in your React component
            console.log(data);
            setCartItems(data.items);
            //Kartta ki ürünlerin toplam tutarı
            setTotalAmount(data.totalAmount);
        });
    }

    return (
        <CartContext.Provider 
            value={{ 
                isCartOpen,
                total,
                totalAmount,
                cartItems,
                toggleCart, 
                closeCart,
                setTotal,
                setTotalAmount,
                setCartItems,
                order,
                getTotalAmount
            }}>
        {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
