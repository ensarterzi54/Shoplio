interface OrderDetails {
    orderDetailID: number;
    orderID: number;
    productID: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export default OrderDetails;