import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import { imageMap } from '../../utils/productImages';
import { filterProductsBySearch } from '../../utils/productSearch';
import './ProductList.css';

const PRODUCTS_PER_PAGE = 6;
const jsonBase = import.meta.env.BASE_URL || '/';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const qParam = (searchParams.get('q') || '').trim();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch(`${jsonBase}products.json`),
                    fetch(`${jsonBase}category.json`)
                ]);

                if (!productsRes.ok) {
                    throw new Error('Không thể tải dữ liệu sản phẩm');
                }

                const data = await productsRes.json();
                const mappedProducts = data.map((item) => ({
                    ...item,
                    image: imageMap[item.imageKey] || item.image
                }));

                setProducts(mappedProducts);

                if (categoriesRes.ok) {
                    const catData = await categoriesRes.json();
                    setCategories(Array.isArray(catData) ? catData : []);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const filteredProducts = useMemo(() => {
        if (qParam) {
            return filterProductsBySearch(products, qParam);
        }
        return selectedCategoryId == null
            ? products
            : products.filter((p) => p.categoryid === selectedCategoryId);
    }, [products, selectedCategoryId, qParam]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));

    useEffect(() => {
        setCurrentPage((p) => Math.min(p, totalPages));
    }, [totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategoryId, qParam]);

    /** Khi tìm theo tên (?q=), bỏ chọn danh mục để lọc đúng kiểu “theo tên” trên cả cửa hàng. */
    useEffect(() => {
        if (qParam) setSelectedCategoryId(null);
    }, [qParam]);

    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * PRODUCTS_PER_PAGE;
    const visibleProducts = filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);

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
            <div className="product-list-layout">
                {categories.length > 0 && (
                    <aside className="product-list-sidebar" aria-label="Lọc theo danh mục">
                        <h2 className="product-list-sidebar__title">Danh mục</h2>
                        <ul className="product-list-sidebar__list">
                            <li>
                                <button
                                    type="button"
                                    className={`product-list-sidebar__btn${selectedCategoryId == null ? ' product-list-sidebar__btn--active' : ''}`}
                                    onClick={() => setSelectedCategoryId(null)}
                                >
                                    Tất cả
                                </button>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <button
                                        type="button"
                                        className={`product-list-sidebar__btn${selectedCategoryId === cat.id ? ' product-list-sidebar__btn--active' : ''}`}
                                        onClick={() => setSelectedCategoryId(cat.id)}
                                    >
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>
                )}
                <div className="product-list-main">
                    {qParam ? (
                        <p className="product-list-search-hint" role="status">
                            {filteredProducts.length > 0
                                ? `Tìm theo tên «${qParam}» — ${filteredProducts.length} sản phẩm`
                                : `Không có sản phẩm khớp «${qParam}». Thử từ khóa khác, hoặc chọn «Tất cả» ở danh mục để tìm trên toàn bộ tên sản phẩm.`}
                        </p>
                    ) : null}
                    {filteredProducts.length === 0 && !qParam ? (
                        <p className="product-list-empty">Không có sản phẩm trong danh mục này.</p>
                    ) : null}
                    {filteredProducts.length > 0 ? (
                    <div className="product-list">
                        {visibleProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    ) : null}
                    {filteredProducts.length > PRODUCTS_PER_PAGE && filteredProducts.length > 0 && (
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
            </div>
        </div>
    );
};

export default ProductList;

