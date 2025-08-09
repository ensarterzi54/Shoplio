import { useEffect } from "react";
import NavBar from "../components/NavBar"
import { useOrder } from "../context/OrderContext"
import Cart from "../components/Cart";

const Orders = () => {
    const { orders, getOrders, getOrderDetails } = useOrder()

    useEffect(() => {
        getOrders()
    }, [])

    const handleDetailsClick = (order: object, orderId: number) => {
        console.log("Order details clicked:", order);
        getOrderDetails(order, orderId)
    }

    return (
        <>
            <NavBar />
            <Cart />
            <form className="bg0 p-t-75 p-b-85">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 col-xl-12 m-lr-auto m-b-50">
                            <div className="m-l-25 m-r--38 m-lr-0-xl">
                                <div className="wrap-table-shopping-cart">
                                    <table className="table-shopping-cart">
                                        <tbody>
                                            <tr className="table_head">
                                            <th className="column-1">Satış ID</th>
                                            <th className="column-2">Toplam Tutar</th>
                                            <th className="column-3">Sipariş Tarihi</th>
                                            <th className="column-4">Durum</th>
                                            <th className="column-5"></th>
                                            </tr>
                                            {
                                                orders && orders.map((order) => (
                                                    <tr className="table_row" key={order.orderID}>
                                                        {/* <td className="column-1">
                                                            <div className="how-itemcart1">
                                                                <img src="images/item-cart-04.jpg" alt="IMG" />
                                                            </div>
                                                        </td> */}
                                                        <td className="column-1">{order.orderID}</td>
                                                        <td className="column-2">{order.totalAmount} TL</td>
                                                        <td className="column-3">
                                                            {order.orderDate}
                                                        </td>
                                                        <td className="column-4">{order.status}</td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary"
                                                                onClick={() => handleDetailsClick(order, order.orderID)}
                                                            >
                                                                Detay
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>

    )
}

export default Orders
