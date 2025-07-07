import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import { useCart } from '../context/CartContext';
import { useProduct } from '../context/ProductContext';

const Products = () => {
  const { totalAmount, cartItems, total, setTotalAmount, setCartItems, setTotal, order, getTotalAmount } = useCart()
  const { products, categories, filtredCatogory, searchedProducts, sortProducts } = useProduct()
  const [activeCategory, setActiveCategory] = useState<string | number>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSort, setActiveSort] = useState('');
  const [sortOptions ] = useState([
    'Yüksekten Düşüğe',
    'Düşükten Yükseğe'
  ])

   // Sayfa ilk yüklendiğinde 'all' seçili olacak
  useEffect(() => {
    setActiveCategory('all');
  }, []);

  const handleClick = (categoryId: number | string, categoryName: string) => {
    setActiveCategory(categoryId)
    filtredCatogory(categoryName)
  }

  useEffect(() => {
    // Sepet açma/kapama eventlerini sadece bir kez ekle
    $('.js-show-cart').on('click', function () {
      $('.js-panel-cart').addClass('show-header-cart')
    })
    $('.js-hide-cart').on('click', function () {
      $('.js-panel-cart').removeClass('show-header-cart')
    })
    $('.js-show-filter').on('click',function(){
        $(this).toggleClass('show-filter')
        $('.panel-filter').slideToggle(400)

        if($('.js-show-search').hasClass('show-search')) {
            $('.js-show-search').removeClass('show-search')
            $('.panel-search').slideUp(400)
        }    
    })
    $('.js-show-search').on('click',function(){
        $(this).toggleClass('show-search');
        $('.panel-search').slideToggle(400);

        if($('.js-show-filter').hasClass('show-filter')) {
            $('.js-show-filter').removeClass('show-filter');
            $('.panel-filter').slideUp(400);
        }    
    })
    $(document).on('click', '.js-show-modal1', function (e) {
      e.preventDefault();
      $('.js-modal1').addClass('show-modal1');
    });
    $(document).on('click', '.js-hide-modal1', function () {
      $('.js-modal1').removeClass('show-modal1');
    });
    

    // Temizlik: component unmount olunca eventleri kaldır
    return () => {
      $('.js-show-cart').off('click')
      $('.js-hide-cart').off('click')
      $('.js-show-filter').off('click')
      $('.js-show-search').off('click')
      $(document).off('click', '.js-show-modal1');
      $(document).off('click', '.js-hide-modal1');
    }
  }, [])

  // filtredCatogory("Telefon")

  return (
    <>
      <NavBar />

      {/* Sepet */}
        <div className="wrap-header-cart js-panel-cart">
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
                      <div className="header-cart-item-img">
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

                  {/* <a href="shoping-cart.html" className="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-b-10">
                    Check Out
                  </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* Product */}
      <div className="bg0 m-t-23 p-b-140">
        <div className="container">
          <div className="flex-w flex-sb-m p-b-52">
            <div className="flex-w flex-l-m filter-tope-group m-tb-10">
              <button
                className={`stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 ${
                  activeCategory === 'all' ? 'how-active1' : ''
                }`}
                onClick={() => handleClick("all", "")}
                data-filter="*"
              >
                Tüm Kategoriler
              </button>
              <ul>
                {
                  categories &&
                    categories.map((category) => (
                      <button
                        key={category.categoryId}
                        className={`stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 ${
                          activeCategory === category.categoryId ? 'how-active1' : ''
                        }`}
                        onClick={() => handleClick(category.categoryId, category.categoryName)}
                        data-filter={`.${category.categoryName.toLowerCase()}`}
                      >
                        {category.categoryName}
                      </button>
                    ))
                }
              </ul>
            </div>
            <div className="flex-w flex-c-m m-tb-10">
              <div className="flex-c-m stext-106 cl6 size-104 bor4 pointer hov-btn3 trans-04 m-r-8 m-tb-4 js-show-filter">
                <i className="icon-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-filter-list" />
                <i className="icon-close-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-close dis-none" />
                Filter
              </div>
              <div className="flex-c-m stext-106 cl6 size-105 bor4 pointer hov-btn3 trans-04 m-tb-4 js-show-search">
                <i className="icon-search cl2 m-r-6 fs-15 trans-04 zmdi zmdi-search" />
                <i className="icon-close-search cl2 m-r-6 fs-15 trans-04 zmdi zmdi-close dis-none" />
                Search
              </div>
            </div>
            {/* Search product */}
            <div className="dis-none panel-search w-full p-t-10 p-b-15">
              <div className="bor8 dis-flex p-l-15">
                <button 
                  className="size-113 flex-c-m fs-16 cl2 hov-cl1 trans-04" 
                  onClick={(e) => {
                    e.preventDefault()
                    const params = new URLSearchParams(searchQuery)
                    params.append('search', searchQuery)
                    searchedProducts(params)
                    setActiveCategory('all')
                  }}
                >
                  <i className="zmdi zmdi-search" />
                </button>
                <input
                  className="mtext-107 cl2 size-114 plh2 p-r-15"
                  type="text"
                  name="search-product"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {/* Filter */}
            <div className="dis-none panel-filter w-full p-t-10">
              <div className="wrap-filter flex-w bg6 w-full p-lr-40 p-t-27 p-lr-15-sm">
                <div className="filter-col1 p-r-15 p-b-27">
                  <div className="mtext-102 cl2 p-b-15">Fiyata Göre Sırala</div>
                  <ul>
                    {
                      sortOptions.map((option) => (
                        <li key={option} className="p-b-6">
                          <a
                            href="#"
                            className={`filter-link stext-106 trans-04 ${
                              activeSort === option ? 'filter-link-active' : ''
                            }`}
                            onClick={(e) => {
                              e.preventDefault()
                              setActiveSort(option)
                              sortProducts(option === 'Yüksekten Düşüğe' ? 'desc' : 'asc')
                            }}
                          >
                            {option}
                          </a>
                        </li>
                      ))
                    }
                  </ul>
                </div>
                <div className="filter-col2 p-r-15 p-b-27">
                  <div className="mtext-102 cl2 p-b-15">Price</div>
                  <ul>
                    <li className="p-b-6">
                      <a
                        href="#"
                        className="filter-link stext-106 trans-04 filter-link-active"
                      >
                        All
                      </a>
                    </li>
                    <li className="p-b-6">
                      <a href="#" className="filter-link stext-106 trans-04">
                        $0.00 - $50.00
                      </a>
                    </li>
                    <li className="p-b-6">
                      <a href="#" className="filter-link stext-106 trans-04">
                        $50.00 - $100.00
                      </a>
                    </li>
                    <li className="p-b-6">
                      <a href="#" className="filter-link stext-106 trans-04">
                        $100.00 - $150.00
                      </a>
                    </li>
                    <li className="p-b-6">
                      <a href="#" className="filter-link stext-106 trans-04">
                        $150.00 - $200.00
                      </a>
                    </li>
                    <li className="p-b-6">
                      <a href="#" className="filter-link stext-106 trans-04">
                        $200.00+
                      </a>
                    </li>
                  </ul>
                </div>
                {/* <div className="filter-col3 p-r-15 p-b-27">
                  <div className="mtext-102 cl2 p-b-15">Color</div>
                  <ul>
                    <li className="p-b-6">
                      <span className="fs-15 lh-12 m-r-6" style={{ color: "#222" }}>
                        <i className="zmdi zmdi-circle" />
                      </span>
                      <a href="#" className="filter-link stext-106 trans-04">
                        Black
                      </a>
                    </li>
                    <li className="p-b-6">
                      <span
                        className="fs-15 lh-12 m-r-6"
                        style={{ color: "#4272d7" }}
                      >
                        <i className="zmdi zmdi-circle" />
                      </span>
                      <a
                        href="#"
                        className="filter-link stext-106 trans-04 filter-link-active"
                      >
                        Blue
                      </a>
                    </li>
                    <li className="p-b-6">
                      <span
                        className="fs-15 lh-12 m-r-6"
                        style={{ color: "#b3b3b3" }}
                      >
                        <i className="zmdi zmdi-circle" />
                      </span>
                      <a href="#" className="filter-link stext-106 trans-04">
                        Grey
                      </a>
                    </li>
                    <li className="p-b-6">
                      <span
                        className="fs-15 lh-12 m-r-6"
                        style={{ color: "#00ad5f" }}
                      >
                        <i className="zmdi zmdi-circle" />
                      </span>
                      <a href="#" className="filter-link stext-106 trans-04">
                        Green
                      </a>
                    </li>
                    <li className="p-b-6">
                      <span
                        className="fs-15 lh-12 m-r-6"
                        style={{ color: "#fa4251" }}
                      >
                        <i className="zmdi zmdi-circle" />
                      </span>
                      <a href="#" className="filter-link stext-106 trans-04">
                        Red
                      </a>
                    </li>
                    <li className="p-b-6">
                      <span className="fs-15 lh-12 m-r-6" style={{ color: "#aaa" }}>
                        <i className="zmdi zmdi-circle-o" />
                      </span>
                      <a href="#" className="filter-link stext-106 trans-04">
                        White
                      </a>
                    </li>
                  </ul>
                </div> */}

                {/* <div className="filter-col4 p-b-27">
                  <div className="mtext-102 cl2 p-b-15">Tags</div>
                  <div className="flex-w p-t-4 m-r--5">
                    <a
                      href="#"
                      className="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                    >
                      Fashion
                    </a>
                    <a
                      href="#"
                      className="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                    >
                      Lifestyle
                    </a>
                    <a
                      href="#"
                      className="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                    >
                      Denim
                    </a>
                    <a
                      href="#"
                      className="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                    >
                      Streetstyle
                    </a>
                    <a
                      href="#"
                      className="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                    >
                      Crafts
                    </a>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="row isotope-grid">
            {
              products.map(product => (
                <>
                  <div className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women">
                    {/* Block2 */}
                    <div className="block2">
                      <div className="block2-pic hov-img0">
                        <img src="images/product-01.jpg" alt="IMG-PRODUCT" />
                        <a
                          href="#"
                          className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                        >
                          İncele
                        </a>
                      </div>
                      <div className="block2-txt flex-w flex-t p-t-14">
                        <div className="block2-txt-child1 flex-col-l ">
                          <a
                            href="product-detail.html"
                            className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                          >
                            {product.productName}
                          </a>
                          <span className="stext-105 cl3">{product.unitPrice} TL</span>
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
                </>
              ))
            }
              
          </div>
          {/* Load more */}
          <div className="flex-c-m flex-w w-full p-t-45">
            <a
              href="#"
              className="flex-c-m stext-101 cl5 size-103 bg2 bor1 hov-btn1 p-lr-15 trans-04"
            >
              Load More
            </a>
          </div>
        </div>
      </div>
    </>

  );
};

export default Products;
