import React, { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { CardItem } from '../models'

const Cart = () => {
    const { isCartOpen, total, cartItems, closeCart, setTotal, setCartItems, order, removeFromCart } = useCart()
    const [totalAmount, setTotalAmount] = useState<number>(0)

    return (
        <div className={`wrap-header-cart js-panel-cart ${isCartOpen ? 'show-header-cart' : ''}`}>
            {/* Sepet */}
            <div className="s-full js-hide-cart" onClick={closeCart}></div>

            <div className="header-cart flex-col-l p-l-65 p-r-25">
                <div className="header-cart-title flex-w flex-sb-m p-b-8">
                <span className="mtext-103 cl2">
                    Sepetim
                </span>

                <div className="fs-35 lh-10 cl2 p-lr-5 pointer hov-cl1 trans-04 js-hide-cart">
                    <i className="zmdi zmdi-close"></i>
                </div>
                </div>
                
                <div className="header-cart-content flex-w js-pscroll">
                <ul className="header-cart-wrapitem w-full">

                    {
                        cartItems.length > 0 ? cartItems.map(item => (
                            <li className="header-cart-item flex-w flex-t m-b-12">
                                <div className="header-cart-item-img" onClick={() => removeFromCart("ali@gmail.com", item.productID)}>
                                    <img src="images/item-cart-01.jpg" alt="IMG" />
                                </div>

                                <div className="header-cart-item-txt p-t-8">
                                    <a href="#" className="header-cart-item-name m-b-18 hov-cl1 trans-04">
                                        { item.productName }
                                    </a>

                                    <span className="header-cart-item-info">
                                        <p>{ item.quantity } Adet</p>
                                        { item.quantity } x { item.unitPrice } TL
                                    </span>
                                </div>
                            </li>
                        )) : null
                    }
                </ul>
                <div className="w-full">
                    <div className="header-cart-total w-full p-tb-40">
                    Toplam Tutar: { totalAmount }  TL
                    </div>

                    <div className="header-cart-buttons flex-w w-full">
                    <button
                        className="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-r-8 m-b-10"
                        onClick={order}
                    >
                        Sipariş ver
                    </button>

                    {/* <a href="shoping-cart.html" className="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-b-10">
                        Check Out
                    </a> */}
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
