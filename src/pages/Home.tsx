import { useEffect, useState } from 'react'
import $ from 'jquery';
import 'magnific-popup';
import { Product, CardItem } from '../models';
import NavBar from '../components/NavBar';
import { useCart } from '../context/CartContext';
import { useProduct } from '../context/ProductContext';
import Cart from '../components/Cart';
interface TotalCartAmountDto {
  totalCartAmount: number;
}

type AddToCartParams = {
  email: string;
  productId: number;
  quantity: number;
}
const Home = () => {
  const { totalAmount, cartItems, total, setTotalAmount, setCartItems, setTotal, order, getTotalAmount, removeFromCart, getCart } = useCart()
  const { products, setProducts } = useProduct()
  // const [products, setProducts] = useState<Product[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1)
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1))
  };

  const examine = (product: Product) => {
    setSelectedProduct(product);
  }

  const addToCard = async ({ productId, quantity }: Omit<AddToCartParams, "email">) => {
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) throw new Error("Kullanıcı e-posta bilgisi bulunamadı.");

      const response = await fetch("https://localhost:7062/api/Carts/createCartItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          productId,
          quantity,
        }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      console.log("Add to cart response:", data);
      if (!response.ok) {
        throw new Error(data.message || "Bir hata oluştu");
      }

      setQuantity(1);
      getTotalAmount();
      setTimeout(() => {
        getCart();
      }, 300);

      return data;
    } catch (error) {
      console.error("Sepete ekleme hatası:", error);
      throw error;
    }
  };

  const run = async (product: string) => {
    try {
      const res = await fetch('https://localhost:7164/api/ollama/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "prompt": product }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      const data = await res.json();
      console.log('API yanıtı:', data);
      console.log('API yanıtı:', data.response);
    } catch (err) {
      console.error('Hata:', err);
    }
  }

  useEffect(() => {
    run("iphone 12")  
    // Event delegation ile modal açma/kapama
    $(document).on('click', '.js-show-modal1', function (e) {
      e.preventDefault();
      $('.js-modal1').addClass('show-modal1');
    });
    $(document).on('click', '.js-hide-modal1', function () {
      $('.js-modal1').removeClass('show-modal1');
    });
    return () => {
      $(document).off('click', '.js-show-modal1');
      $(document).off('click', '.js-hide-modal1');
    };
  }, []);


  useEffect(() => {
    const email = localStorage.getItem("userEmail") ?? "";
    fetch(`https://localhost:7164/api/cart?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        console.log("Cart Items home sayfası:", data);
        // Use cart data in your React component
        console.log(data.totalAmount);
        setCartItems(data.items);
        setTotalAmount(data.totalAmount);
      });
  }, [])

  useEffect(() => {
    fetch('https://localhost:7164/api/products?&sort=asc')
      .then(res => res.json())
      .then((data: Product[]) => {
        // ...
        setProducts(data);
      })
      .catch(err => {
        console.error('API isteği başarısız:', err);
      });

    
  }, []);
  const fetchCartItem = () => {
    fetch('https://localhost:7164/Cart/Index')
      .then(res => res.json())
      .then(data => {
        console.log("asdad")
        console.log(data)
        setCartItems(data)
    })
  }
  return (
    <div>
        
        <NavBar />
        
        <Cart />
        {/* Sepet */}
        {/* <div className="wrap-header-cart js-panel-cart">
          <div className="s-full js-hide-cart"></div>

          <div className="header-cart flex-col-l p-l-65 p-r-25">
            <div className="header-cart-title flex-w flex-sb-m p-b-8">
              <span className="mtext-103 cl2">
                Your Cart
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
                      <div 
                        className="header-cart-item-img" 
                        onClick={() => {
                          console.log("Removing item from cart:", item.productID);
                          const userEmail = localStorage.getItem("userEmail");
                          if (userEmail) {
                            removeFromCart(userEmail, item.productID);
                          } else {
                            console.warn("Kullanıcı e-postası bulunamadı.");
                          }
                        }}
                      >
                        <img src="images/item-cart-01.jpg" alt="IMG" />
                      </div>

                      <div className="header-cart-item-txt p-t-8">
                        <a href="#" className="header-cart-item-name m-b-18 hov-cl1 trans-04">
                          {item.productName }
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

                </div>
              </div>
            </div>
          </div>
        </div> */}

        <section className="sec-product bg0 p-t-100 p-b-50">
          <div className="container">
            <div className="p-b-32">
              <h3 className="ltext-105 cl5 txt-center respon1">
                Ürünler
              </h3>
            </div>

            <div className="tab01">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item p-b-10">
                  <a className="nav-link active" data-toggle="tab" href="#best-seller" role="tab">Best Seller</a>
                </li>

                <li className="nav-item p-b-10">
                  <a className="nav-link" data-toggle="tab" href="#featured" role="tab">Featured</a>
                </li>

                <li className="nav-item p-b-10">
                  <a className="nav-link" data-toggle="tab" href="#sale" role="tab">Sale</a>
                </li>

                <li className="nav-item p-b-10">
                  <a className="nav-link" data-toggle="tab" href="#top-rate" role="tab">Top Rate</a>
                </li>
              </ul>

              <div className="tab-content p-t-50">
                <div className="tab-pane fade show active" id="best-seller" role="tabpanel">
                  <div className="wrap-slick2">
                    <div className="slick2">
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                      {products.map(product => (
                        <div
                          key={product.productID}
                          className="item-slick2 p-l-15 p-r-15 p-t-15 p-b-15"
                          style={{ width: "25%" }}
                        >
                          <div className="block2">
                            <div className="block2-pic hov-img0">
                              <img src="images/product-01.jpg" alt="IMG-PRODUCT" />
                              <a
                                href="#"
                                className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                                onClick={() => examine(product)}
                              >
                                İncele
                              </a>
                            </div>

                            <div className="block2-txt flex-w flex-t p-t-14">
                              <div className="block2-txt-child1 flex-col-l">
                                <a
                                  href="product-detail.html"
                                  className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                                >
                                  {product.productName}
                                </a>
                                <span className="stext-105 cl3">{product.unitPrice}</span>
                              </div>

                              <div className="block2-txt-child2 flex-r p-t-3">
                                <a
                                  href="#"
                                  className="btn-addwish-b2 dis-block pos-relative js-addwish-b2"
                                >
                                  <img
                                    className="icon-heart1 dis-block trans-04"
                                    src="images/icons/icon-heart-01.png"
                                    alt="ICON"
                                  />
                                  <img
                                    className="icon-heart2 dis-block trans-04 ab-t-l"
                                    src="images/icons/icon-heart-02.png"
                                    alt="ICON"
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>


                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="sec-blog bg0 p-t-60 p-b-90">
          <div className="container">
            <div className="p-b-66">
              <h3 className="ltext-105 cl5 txt-center respon1">
                Our Blogs
              </h3>
            </div>

            <div className="row">
              <div className="col-sm-6 col-md-4 p-b-40">
                <div className="blog-item">
                  <div className="hov-img0">
                    <a href="blog-detail.html">
                      <img src="images/blog-01.jpg" alt="IMG-BLOG" />
                    </a>
                  </div>

                  <div className="p-t-15">
                    <div className="stext-107 flex-w p-b-14">
                      <span className="m-r-3">
                        <span className="cl4">
                          By
                        </span>

                        <span className="cl5">
                          Nancy Ward
                        </span>
                      </span>

                      <span>
                        <span className="cl4">
                          on
                        </span>

                        <span className="cl5">
                          July 22, 2017 
                        </span>
                      </span>
                    </div>

                    <h4 className="p-b-12">
                      <a href="blog-detail.html" className="mtext-101 cl2 hov-cl1 trans-04">
                        8 Inspiring Ways to Wear Dresses in the Winter
                      </a>
                    </h4>

                    <p className="stext-108 cl6">
                      Duis ut velit gravida nibh bibendum commodo. Suspendisse pellentesque mattis augue id euismod. Interdum et male-suada fames
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-md-4 p-b-40">
                <div className="blog-item">
                  <div className="hov-img0">
                    <a href="blog-detail.html">
                      <img src="images/blog-02.jpg" alt="IMG-BLOG" />
                    </a>
                  </div>

                  <div className="p-t-15">
                    <div className="stext-107 flex-w p-b-14">
                      <span className="m-r-3">
                        <span className="cl4">
                          By
                        </span>

                        <span className="cl5">
                          Nancy Ward
                        </span>
                      </span>

                      <span>
                        <span className="cl4">
                          on
                        </span>

                        <span className="cl5">
                          July 18, 2017
                        </span>
                      </span>
                    </div>

                    <h4 className="p-b-12">
                      <a href="blog-detail.html" className="mtext-101 cl2 hov-cl1 trans-04">
                        The Great Big List of Men’s Gifts for the Holidays
                      </a>
                    </h4>

                    <p className="stext-108 cl6">
                      Nullam scelerisque, lacus sed consequat laoreet, dui enim iaculis leo, eu viverra ex nulla in tellus. Nullam nec ornare tellus, ac fringilla lacus. Ut sit ame
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-md-4 p-b-40">
                <div className="blog-item">
                  <div className="hov-img0">
                    <a href="blog-detail.html">
                      <img src="images/blog-03.jpg" alt="IMG-BLOG" />
                    </a>
                  </div>

                  <div className="p-t-15">
                    <div className="stext-107 flex-w p-b-14">
                      <span className="m-r-3">
                        <span className="cl4">
                          By
                        </span>

                        <span className="cl5">
                          Nancy Ward
                        </span>
                      </span>

                      <span>
                        <span className="cl4">
                          on
                        </span>

                        <span className="cl5">
                          July 2, 2017 
                        </span>
                      </span>
                    </div>

                    <h4 className="p-b-12">
                      <a href="blog-detail.html" className="mtext-101 cl2 hov-cl1 trans-04">
                        5 Winter-to-Spring Fashion Trends to Try Now
                      </a>
                    </h4>

                    <p className="stext-108 cl6">
                      Proin nec vehicula lorem, a efficitur ex. Nam vehicula nulla vel erat tincidunt, sed hendrerit ligula porttitor. Fusce sit amet maximus nunc
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <footer className="bg3 p-t-75 p-b-32">
          <div className="container">
            <div className="row">
              <div className="col-sm-6 col-lg-3 p-b-50">
                <h4 className="stext-301 cl0 p-b-30">
                  Categories
                </h4>

                <ul>
                  <li className="p-b-10">
                    <a href="#" className="stext-107 cl7 hov-cl1 trans-04">
                      Women
                    </a>
                  </li>

                  <li className="p-b-10">
                    <a href="#" className="stext-107 cl7 hov-cl1 trans-04">
                      Men
                    </a>
                  </li>

                  <li className="p-b-10">
                    <a href="#" className="stext-107 cl7 hov-cl1 trans-04">
                      Shoes
                    </a>
                  </li>

                  <li className="p-b-10">
                    <a href="#" className="stext-107 cl7 hov-cl1 trans-04">
                      Watches
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-sm-6 col-lg-3 p-b-50">
                <h4 className="stext-301 cl0 p-b-30">
                  Help
                </h4>

                <ul>
                  <li className="p-b-10">
                    <a href="#" className="stext-107 cl7 hov-cl1 trans-04">
                      Track Order
                    </a>
                  </li>

                  <li className="p-b-10">
                    <a href="#" className="stext-107 cl7 hov-cl1 trans-04">
                      Returns 
                    </a>
                  </li>

                  <li className="p-b-10">
                    <a href="#" className="stext-107 cl7 hov-cl1 trans-04">
                      Shipping
                    </a>
                  </li>

                  <li className="p-b-10">
                    <a href="#" className="stext-107 cl7 hov-cl1 trans-04">
                      FAQs
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-sm-6 col-lg-3 p-b-50">
                <h4 className="stext-301 cl0 p-b-30">
                  GET IN TOUCH
                </h4>

                <p className="stext-107 cl7 size-201">
                  Any questions? Let us know in store at 8th floor, 379 Hudson St, New York, NY 10018 or call us on (+1) 96 716 6879
                </p>

                <div className="p-t-27">
                  <a href="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16">
                    <i className="fa fa-facebook"></i>
                  </a>

                  <a href="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16">
                    <i className="fa fa-instagram"></i>
                  </a>

                  <a href="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16">
                    <i className="fa fa-pinterest-p"></i>
                  </a>
                </div>
              </div>

              <div className="col-sm-6 col-lg-3 p-b-50">
                <h4 className="stext-301 cl0 p-b-30">
                  Newsletter
                </h4>

                <form>
                  <div className="wrap-input1 w-full p-b-4">
                    <input className="input1 bg-none plh1 stext-107 cl7" type="text" name="email" placeholder="email@example.com" />
                    <div className="focus-input1 trans-04"></div>
                  </div>

                  <div className="p-t-18">
                    <button className="flex-c-m stext-101 cl0 size-103 bg1 bor1 hov-btn2 p-lr-15 trans-04">
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="p-t-40">
              <div className="flex-c-m flex-w p-b-18">
                <a href="#" className="m-all-1">
                  <img src="images/icons/icon-pay-01.png" alt="ICON-PAY" />
                </a>

                <a href="#" className="m-all-1">
                  <img src="images/icons/icon-pay-02.png" alt="ICON-PAY" />
                </a>

                <a href="#" className="m-all-1">
                  <img src="images/icons/icon-pay-03.png" alt="ICON-PAY" />
                </a>

                <a href="#" className="m-all-1">
                  <img src="images/icons/icon-pay-04.png" alt="ICON-PAY" />
                </a>

                <a href="#" className="m-all-1">
                  <img src="images/icons/icon-pay-05.png" alt="ICON-PAY" />
                </a>
              </div>

              <p className="stext-107 cl6 txt-center">
      Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | Made with <i className="fa fa-heart-o" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a> &amp; distributed by <a href="https://themewagon.com" target="_blank">ThemeWagon</a>

              </p>
            </div>
          </div>
        </footer>


        <div className="btn-back-to-top" id="myBtn">
          <span className="symbol-btn-back-to-top">
            <i className="zmdi zmdi-chevron-up"></i>
          </span>
        </div>

        <div className="wrap-modal1 js-modal1 p-t-60 p-b-20">
          <div className="overlay-modal1 js-hide-modal1"></div>

          <div className="container">
            <div className="bg0 p-t-60 p-b-30 p-lr-15-lg how-pos3-parent">
              <button className="how-pos3 hov3 trans-04 js-hide-modal1" onClick={() => setQuantity(1)}>
                <img src="images/icons/icon-close.png" alt="CLOSE" />
              </button>

              <div className="row">
                <div className="col-md-6 col-lg-7 p-b-30">
                  <div className="p-l-25 p-r-30 p-lr-0-lg">
                    <div className="wrap-slick3 flex-sb flex-w">
                      <div className="wrap-slick3-dots"></div>
                      <div className="wrap-slick3-arrows flex-sb-m flex-w"></div>

                      <div className="slick3 gallery-lb">
                        <div className="item-slick3" data-thumb="images/product-detail-01.jpg">
                          <div className="wrap-pic-w pos-relative">
                            <img src="images/product-detail-01.jpg" alt="IMG-PRODUCT" />

                            <a className="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04" href="images/product-detail-01.jpg">
                              <i className="fa fa-expand"></i>
                            </a>
                          </div>
                        </div>

                        {/* <div className="item-slick3" data-thumb="images/product-detail-02.jpg">
                          <div className="wrap-pic-w pos-relative">
                            <img src="images/product-detail-02.jpg" alt="IMG-PRODUCT" />

                            <a className="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04" href="images/product-detail-02.jpg">
                              <i className="fa fa-expand"></i>
                            </a>
                          </div>
                        </div>

                        <div className="item-slick3" data-thumb="images/product-detail-03.jpg">
                          <div className="wrap-pic-w pos-relative">
                            <img src="images/product-detail-03.jpg" alt="IMG-PRODUCT" />

                            <a className="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04" href="images/product-detail-03.jpg">
                              <i className="fa fa-expand"></i>
                            </a>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
                {
                  selectedProduct && (
                    <div className="col-md-6 col-lg-5 p-b-30">
                      <div className="p-r-50 p-t-5 p-lr-0-lg">
                        <h4 className="mtext-105 cl2 js-name-detail p-b-14">
                          {selectedProduct.productName}
                        </h4>

                        <span className="mtext-106 cl2">
                          {selectedProduct.unitPrice}
                        </span>

                        {/* <p className="stext-102 cl3 p-t-23">
                          Nulla eget sem vitae eros pharetra viverra. Nam vitae luctus ligula. Mauris consequat ornare feugiat.
                        </p> */}
                        
                        <div className="p-t-33">
                          {/* <div className="flex-w flex-r-m p-b-10">
                            <div className="size-203 flex-c-m respon6">
                              Size
                            </div>

                            <div className="size-204 respon6-next">
                              <div className="rs1-select2 bor8 bg0">
                                <select className="js-select2" name="time">
                                  <option>Choose an option</option>
                                  <option>Size S</option>
                                  <option>Size M</option>
                                  <option>Size L</option>
                                  <option>Size XL</option>
                                </select>
                                <div className="dropDownSelect2"></div>
                              </div>
                            </div>
                          </div>

                          <div className="flex-w flex-r-m p-b-10">
                            <div className="size-203 flex-c-m respon6">
                              Color
                            </div>

                            <div className="size-204 respon6-next">
                              <div className="rs1-select2 bor8 bg0">
                                <select className="js-select2" name="time">
                                  <option>Choose an option</option>
                                  <option>Red</option>
                                  <option>Blue</option>
                                  <option>White</option>
                                  <option>Grey</option>
                                </select>
                                <div className="dropDownSelect2"></div>
                              </div>
                            </div>
                          </div> */}

                          <div className="flex-w flex-r-m p-b-10">
                            <div className="size-204 flex-w flex-m respon6-next">
                              <div className="wrap-num-product flex-w m-r-20 m-tb-10">
                                <div
                                  className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                                  onClick={decreaseQuantity}
                                >
                                  <i className="fs-16 zmdi zmdi-minus"></i>
                                </div>

                                <input
                                  className="mtext-104 cl3 txt-center num-product"
                                  type="number"
                                  name="num-product"
                                  value={quantity}
                                  readOnly
                                />

                                <div
                                  className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                                  onClick={increaseQuantity}
                                >
                                  <i className="fs-16 zmdi zmdi-plus"></i>
                                </div>
                              </div>

                              <button 
                                className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail"
                                onClick={() => {
                                  if (selectedProduct) {
                                    addToCard({
                                      productId: selectedProduct.productID,
                                      quantity: quantity,
                                    });
                                  }
                                }}
                              >
                                Ürünü Sepete Ekle
                              </button>
                            </div>
                          </div>	
                        </div>

                        <div className="flex-w flex-m p-l-100 p-t-40 respon7">
                          <div className="flex-m bor9 p-r-10 m-r-11">
                            <a href="#" className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 js-addwish-detail tooltip100" data-tooltip="Add to Wishlist">
                              <i className="zmdi zmdi-favorite"></i>
                            </a>
                          </div>

                          <a href="#" className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" data-tooltip="Facebook">
                            <i className="fa fa-facebook"></i>
                          </a>

                          <a href="#" className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" data-tooltip="Twitter">
                            <i className="fa fa-twitter"></i>
                          </a>

                          <a href="#" className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100" data-tooltip="Google Plus">
                            <i className="fa fa-google-plus"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Home
