import React, { createContext, useState, useContext, useEffect } from 'react'
import { Product } from '../models';
import { Category } from '../models/Category';

interface ProductContextType {
    products: Product[]
    categories: Category[]
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>
    searchedProducts: (queryParams: URLSearchParams) => void
    filtredCatogory: (category: string) => void
    sortProducts: (sortDirection: 'asc' | 'desc') => void
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([]);
    
    useEffect(() => {
        fetch('https://localhost:7164/api/products?&sort=asc')
            .then(res => res.json())
            .then((data: Product[]) => {
                setProducts(data)
            })
            .catch(err => {
                console.error('API isteği başarısız:', err)
            })

        fetch('https://localhost:7164/api/categories')
            .then(res => res.json())
            .then((data: Category[]) => {
                    console.log('Fetched categories:', data)
                    setCategories(data)
                }
            )
            .catch(err => console.error('Kategori API isteği başarısız:', err));
    }, [])

    const searchedProducts = (queryParams: URLSearchParams) => {
        console.log('Searching products with query:', queryParams)
        fetch(`https://localhost:7164/api/products?${queryParams.toString()}`)
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text()
                    throw new Error(`Sunucu hatası: ${res.status} - ${text}`)
                }
                return res.json()
            })
            .then((data: Product[]) => {
                console.log('Searched products:', data)
                setProducts(data)
            })
            .catch(err => {
                console.error('API isteği başarısız:', err.message)
            })
    }

    const filtredCatogory = (category: string) => {
        fetch(`https://localhost:7164/api/products?category=${encodeURIComponent(category)}`)
            .then(res => res.json())
            .then((data: Product[]) => {
                console.log('Filtered products by category:', data)
                setProducts(data)
            })
            .catch(err => {
                console.error('API isteği başarısız:', err)
            });
    }

    const sortProducts = (sortDirection: 'asc' | 'desc') => {
        fetch(`https://localhost:7164/api/products?&sort=${sortDirection}`)
            .then(res => res.json())
            .then((data: Product[]) => {
                setProducts(data)
            })
            .catch(err => {
                console.error('API isteği başarısız:', err)
            })
    };



    return (
        <ProductContext.Provider 
            value={{
                products,
                categories,
                setProducts,
                setCategories,
                searchedProducts,
                filtredCatogory,
                sortProducts
            }}
        >
            {children}
        </ProductContext.Provider>
    )
}

export const useProduct = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
