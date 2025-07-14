import React, { createContext, useState, useContext, useEffect } from 'react'
import { Order } from '../models'
import OrderDetails from '../models/OrderDetails'
import { useNavigate } from 'react-router-dom';


interface OrderContextType {
    orders: Order[]
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>
    getOrders: () => void
    orderDetails: OrderDetails[]
    setOrderDetails: React.Dispatch<React.SetStateAction<OrderDetails[]>>
    getOrderDetails: (id: number) => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([])
    const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        console.log("Fetching orders...")
        
    }, [])
    const getOrders = () => {
        console.log("Fetching orders...");
        const email = localStorage.getItem("userEmail");

        if (!email) {
            console.error("Email localStorage'da bulunamadı.");
            return;
        }

        fetch(`https://localhost:7164/Order/GetOrders?email=${encodeURIComponent(email)}`)
            .then(res => res.json())
            .then(data => {
                console.log("Gelen veri:", data);
                setOrders(data);
            })
            .catch(err => console.error(err));
    }

    const getOrderDetails = (orderId: number) => {
        fetch(`https://localhost:7164/Order/Details?id=${orderId}`)
            .then(async res => {
                if (!res.ok) {
                    throw new Error("Sunucudan geçerli cevap alınamadı.");
                }
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return res.json();
                } else {
                    const text = await res.text();
                    throw new Error("Beklenmeyen cevap: " + text);
                }
            })
            .then(data => {
                console.log("Gelen detay verisi:", data)
                navigate(`/order-details/${orderId}`, { state: { orderDetailsData: data } })
                // setOrderDetails(data) gibi bir state'e atayabilirsin
                setOrderDetails(data);
            })
            .catch(err => console.error("Detay fetch hatası:", err));
    };
    return (
        <OrderContext.Provider 
            value={{ 
                orders,
                setOrders,
                getOrders,
                orderDetails,
                setOrderDetails,
                getOrderDetails
            }}
        >
        {children}
        </OrderContext.Provider>
    )
}

export const useOrder = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within a OrderProvider')
  }
  return context
}
