import React, { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useProduct } from '../context/ProductContext'
import { Link, useNavigate } from 'react-router-dom'

const NavBar = () => {
    const { toggleCart, setCartItems } = useCart()
    const { searchedProducts } = useProduct()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [productSearch, setProductSearch] = useState("")

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    // üst kısma eklenmeli
    const userEmail = (() => {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) return '';
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        } catch {
            return '';
        }
    })();

    const handleLogout = () => {
        setCartItems([]);
        localStorage.removeItem('userEmail');
        localStorage.removeItem('jwt');
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev)
        // Hamburger'a tıklanınca popup'ı başlat
        setTimeout(() => {
        $('.gallery-lb').each(function (this: HTMLElement) {
            // @ts-ignore
            $(this).magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery: { enabled: true },
            mainClass: 'mfp-fade'
            })
        })
        }, 0)

        $('.btn-show-menu-mobile').on('click', function(){
            $(this).toggleClass('is-active')
            $('.menu-mobile').slideToggle()
        })
    }
    useEffect(() => {
        // Modal gösterme
        $('.js-show-modal-search').on('click', function () {
        $('.modal-search-header').addClass('show-modal-search');
        $(this).css('opacity', '0');
        });

        // Modal gizleme
        $('.js-hide-modal-search').on('click', function () {
        $('.modal-search-header').removeClass('show-modal-search');
        $('.js-show-modal-search').css('opacity', '1');
        });

        // Bileşen unmount olduğunda event'leri temizle
        return () => {
        $('.js-show-modal-search').off('click');
        $('.js-hide-modal-search').off('click');
        };
    }, []);
    return (
        <div>
            <header className="header-v2">
                <div className="container-menu-desktop trans-03">
                    <div className="wrap-menu-desktop">
                        <nav className="limiter-menu-desktop p-l-45">
                            
                            <a href="#" className="logo">
                                <img src="/images/icons/logo-01.png" alt="IMG-LOGO" />
                            </a>

                            <div className="menu-desktop">
                            <ul className="main-menu">
                                {/* <li className="active-menu">
                                <a href="index.html">Home</a>
                                <ul className="sub-menu">
                                    <li><Link to="/">Anasayfa</Link></li>
                                    <li><Link to="/products">Ürünler</Link></li>
                                </ul>
                                </li> */}
                                <li><Link to="/">Anasayfa</Link></li>
                                <li><Link to="/products">Ürünler</Link></li>
                                {/* <li>
                                <a href="product.html">Shop</a>
                                </li>

                                <li className="label1" data-label1="hot">
                                <a href="shoping-cart.html">Features</a>
                                </li>

                                <li>
                                <a href="blog.html">Blog</a>
                                </li>

                                <li>
                                <a href="about.html">About</a>
                                </li>

                                <li>
                                <a href="contact.html">Contact</a>
                                </li> */}
                            </ul>
                            </div>	

                            <div className="wrap-icon-header flex-w flex-r-m h-full">
                                <div className="relative flex-c-m h-full p-r-24">
                                    <div
                                        className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 cursor-pointer"
                                        onMouseEnter={() => setDropdownOpen(true)}
                                        onMouseLeave={() => setDropdownOpen(false)}
                                    >
                                        <i className="zmdi zmdi-account"></i>

                                        {/* Dropdown Menü */}
                                        {dropdownOpen && (
                                        <div
                                            className="absolute left-1/2 top-full mt-1 -translate-x-1/2 w-36 bg-white border border-gray-300 rounded shadow-lg text-xs z-50"
                                            onMouseEnter={() => setDropdownOpen(true)}
                                            onMouseLeave={() => setDropdownOpen(false)}
                                        >
                                            <div className="px-3 py-1 border-b border-gray-200 text-center truncate">
                                                {userEmail}
                                            </div>
                                            <button
                                                className="block w-full px-3 py-1 text-left hover:bg-gray-100"
                                                onClick={() => navigate('/orders')}
                                            >
                                            Siparişlerim
                                            </button>
                                            <button
                                                className="block w-full px-3 py-1 text-left text-red-600 hover:bg-gray-100"
                                                onClick={handleLogout}
                                            >
                                            Çıkış Yap
                                            </button>
                                        </div>
                                        )}
                                    </div>
                                    </div>

                                <div className="flex-c-m h-full p-r-24">
                                    <div 
                                        className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 js-show-modal-search"
                                    >
                                        <i className="zmdi zmdi-search"></i>
                                    </div>
                                </div>
                                    
                                <div className="flex-c-m h-full p-l-18 p-r-25 bor5">
                                    <div className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 icon-header-noti js-show-cart" data-notify="2">
                                        <i className="zmdi zmdi-shopping-cart"></i>
                                    </div>
                                </div>
                                    
                                <div
                                    className={`btn-show-menu-mobile hamburger hamburger--squeeze ${isSidebarOpen ? 'is-active' : ''}`}
                                    onClick={toggleSidebar}
                                >
                                    <span className="hamburger-box">
                                    <span className="hamburger-inner"></span>
                                    </span>
                                </div>
                            </div>
                        </nav>
                    </div>	
                </div>

                <div className="wrap-header-mobile">
                    {/* <div className="logo-mobile">
                        <a href="index.html"><img src="images/icons/logo-01.png" alt="IMG-LOGO" /></a>
                    </div> */}

                    <div className="wrap-icon-header flex-w flex-r-m h-full m-r-15">
                    <div
                        onClick={toggleCart}
                        className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 icon-header-noti js-show-cart"
                        data-notify="2"
                        >
                        <i className="zmdi zmdi-shopping-cart"></i>
                    </div>

                    <div className="flex-c-m h-full p-lr-10 bor5">
                        <div className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 icon-header-noti js-show-cart" data-notify="2">
                        <i className="zmdi zmdi-shopping-cart"></i>
                        </div>
                    </div>
                    </div>

                    {/* Hamburger buton */}
                    <div
                    className={`btn-show-menu-mobile hamburger hamburger--squeeze ${isSidebarOpen ? 'is-active' : ''}`}
                    onClick={toggleSidebar}
                    >
                    <span className="hamburger-box">
                        <span className="hamburger-inner"></span>
                    </span>
                    </div>

                </div>


                <div className="menu-mobile">
                    <ul className="main-menu-m">
                    <li>
                        <a href="index.html">Home</a>
                        <ul className="sub-menu-m">
                        <li><a href="index.html">Homepage 1</a></li>
                        <li><a href="home-02.html">Homepage 2</a></li>
                        <li><a href="home-03.html">Homepage 3</a></li>
                        </ul>
                        <span className="arrow-main-menu-m">
                        <i className="fa fa-angle-right" aria-hidden="true"></i>
                        </span>
                    </li>

                    <li>
                        <a href="product.html">Shop</a>
                    </li>

                    <li>
                        <a href="shoping-cart.html" className="label1 rs1" data-label1="hot">Features</a>
                    </li>

                    <li>
                        <a href="blog.html">Blog</a>
                    </li>

                    <li>
                        <a href="about.html">About</a>
                    </li>

                    <li>
                        <a href="contact.html">Contact</a>
                    </li>
                    </ul>
                </div>

                <div className="modal-search-header flex-c-m trans-04">
                    <div className="container-search-header">
                        <button className="flex-c-m btn-hide-modal-search trans-04 js-hide-modal-search">
                            <img src="images/icons/icon-close2.png" alt="CLOSE" />
                        </button>

                        <form 
                            className="wrap-search-header flex-w p-l-15"
                            onSubmit={(e) => {
                                e.preventDefault(); // Sayfa yenilemeyi engelle
                                const params = new URLSearchParams();
                                params.append('search', productSearch); // veya 'ürün 1' gibi sabit bir şey
                                searchedProducts(params);
                            }}
                        >
                            <button className="flex-c-m trans-04">
                                <i className="zmdi zmdi-search"></i>
                            </button>

                            <input
                                className="plh3" 
                                type="text" 
                                name="search" 
                                placeholder="Search..." 
                                value={productSearch} 
                                onChange={(e) => setProductSearch(e.target.value)} 
                            />
                            
                        </form>
                    </div>
                </div>
            </header>

            <aside className="wrap-sidebar js-sidebar">
            <div className="s-full js-hide-sidebar"></div>

            <div className="sidebar flex-col-l p-t-22 p-b-25">
                <div className="flex-r w-full p-b-30 p-r-27">
                <div className="fs-35 lh-10 cl2 p-lr-5 pointer hov-cl1 trans-04 js-hide-sidebar">
                    <i className="zmdi zmdi-close"></i>
                </div>
                </div>
                {/* Sidebar menü */}
                <div className={`sidebar-content flex-w w-full p-lr-65 js-pscroll ${isSidebarOpen ? 'show' : 'hide'}`}>
                <ul className="sidebar-link w-full">
                    <li className="p-b-13"><a href="#">Home</a></li>
                    <li className="p-b-13"><a href="#">My Wishlist</a></li>
                    <li className="p-b-13"><a href="#">My Account</a></li>
                    <li className="p-b-13"><a href="#">Track Order</a></li>
                    <li className="p-b-13"><a href="#">Refunds</a></li>
                    <li className="p-b-13"><a href="#">Help & FAQs</a></li>
                </ul>
                </div>
                <div className={`sidebar-content flex-w w-full p-lr-65 js-pscroll`}>
                <ul className="sidebar-link w-full">
                    <li className="p-b-13">
                    <a href="index.html" className="stext-102 cl2 hov-cl1 trans-04">
                        Home
                    </a>
                    </li>

                    <li className="p-b-13">
                    <a href="#" className="stext-102 cl2 hov-cl1 trans-04">
                        My Wishlist
                    </a>
                    </li>

                    <li className="p-b-13">
                    <a href="#" className="stext-102 cl2 hov-cl1 trans-04">
                        My Account
                    </a>
                    </li>

                    <li className="p-b-13">
                    <a href="#" className="stext-102 cl2 hov-cl1 trans-04">
                        Track Oder
                    </a>
                    </li>

                    <li className="p-b-13">
                    <a href="#" className="stext-102 cl2 hov-cl1 trans-04">
                        Refunds
                    </a>
                    </li>

                    <li className="p-b-13">
                    <a href="#" className="stext-102 cl2 hov-cl1 trans-04">
                        Help & FAQs
                    </a>
                    </li>
                </ul>

                <div className="sidebar-gallery w-full p-tb-30">
                    <span className="mtext-101 cl5">
                    @ CozaStore
                    </span>

                    <div className="flex-w flex-sb p-t-36 gallery-lb">
                    <div className="wrap-item-gallery m-b-10">
                        <a className="item-gallery bg-img1" href="images/gallery-01.jpg" data-lightbox="gallery" 
                        style={{ backgroundImage: "url('images/gallery-01.jpg')" }}></a>
                    </div>

                    <div className="wrap-item-gallery m-b-10">
                        <a className="item-gallery bg-img1" href="images/gallery-02.jpg" data-lightbox="gallery" 
                        style={{backgroundImage: "url('images/gallery-02.jpg')"}}></a>
                    </div>

                    <div className="wrap-item-gallery m-b-10">
                        <a className="item-gallery bg-img1" href="images/gallery-03.jpg" data-lightbox="gallery" 
                        style={{backgroundImage: "url('images/gallery-03.jpg')"}}></a>
                    </div>

                    <div className="wrap-item-gallery m-b-10">
                        <a className="item-gallery bg-img1" href="images/gallery-04.jpg" data-lightbox="gallery" 
                        style={{backgroundImage: "url('images/gallery-04.jpg')"}}></a>
                    </div>

                    <div className="wrap-item-gallery m-b-10">
                        <a className="item-gallery bg-img1" href="images/gallery-05.jpg" data-lightbox="gallery" 
                        style={{backgroundImage: "url('images/gallery-05.jpg')"}}></a>
                    </div>

                    <div className="wrap-item-gallery m-b-10">
                        <a className="item-gallery bg-img1" href="images/gallery-06.jpg" data-lightbox="gallery" 
                        style={{backgroundImage: "url('images/gallery-06.jpg')"}}></a>
                    </div>

                    <div className="wrap-item-gallery m-b-10">
                        <a className="item-gallery bg-img1" href="images/gallery-07.jpg" data-lightbox="gallery" 
                        style={{backgroundImage: "url('images/gallery-07.jpg')"}}></a>
                    </div>

                    <div className="wrap-item-gallery m-b-10">
                        <a className="item-gallery bg-img1" href="images/gallery-08.jpg" data-lightbox="gallery" 
                        style={{backgroundImage: "url('images/gallery-08.jpg')"}}></a>
                    </div>

                    <div className="wrap-item-gallery m-b-10">
                        <a className="item-gallery bg-img1" href="images/gallery-09.jpg" data-lightbox="gallery" 
                        style={{backgroundImage: "url('images/gallery-09.jpg')"}}></a>
                    </div>
                    </div>
                </div>

                <div className="sidebar-gallery w-full">
                    <span className="mtext-101 cl5">
                    About Us
                    </span>

                    <p className="stext-108 cl6 p-t-27">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur maximus vulputate hendrerit. Praesent faucibus erat vitae rutrum gravida. Vestibulum tempus mi enim, in molestie sem fermentum quis. 
                    </p>
                </div>
                </div>
            </div>
            </aside>
        </div>
    )
}

export default NavBar
