import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';
import sp1Image from '../../img/sp1.png';
import sp2Image from '../../img/sp2.png';
import sp3Image from '../../img/sp3.png';

const imageMap = {
    sp1: sp1Image,
    sp2: sp2Image,
    sp3: sp3Image
};

const PRODUCTS_PER_PAGE = 6;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetch('/products.json');
                if (!response.ok) {
                    throw new Error('Không thể tải dữ liệu sản phẩm');
                }

                const data = await response.json();
                const mappedProducts = data.map((item) => ({
                    ...item,
                    image: imageMap[item.imageKey] || item.image
                }));

                setProducts(mappedProducts);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadProducts();
    }, []);

    const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));

    useEffect(() => {
        setCurrentPage((p) => Math.min(p, totalPages));
    }, [totalPages]);

    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * PRODUCTS_PER_PAGE;
    const visibleProducts = products.slice(start, start + PRODUCTS_PER_PAGE);

    const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
    const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

    if (isLoading) {
        return <div className="product-list-container">Đang tải sản phẩm...</div>;
    }

    if (error) {
        return <div className="product-list-container">Lỗi: {error}</div>;
    }

    return (
        <div className="product-list-container">
            <div className="product-list">
                {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {products.length > PRODUCTS_PER_PAGE && (
                <div className="product-list-pagination" role="navigation" aria-label="Phân trang sản phẩm">
                    <button
                        type="button"
                        className="product-list-pagination__btn"
                        onClick={goPrev}
                        disabled={safePage <= 1}
                    >
                        ← Trang trước
                    </button>
                    <span className="product-list-pagination__info">
                        Trang {safePage} / {totalPages}
                    </span>
                    <button
                        type="button"
                        className="product-list-pagination__btn"
                        onClick={goNext}
                        disabled={safePage >= totalPages}
                    >
                        Trang sau →
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductList;

