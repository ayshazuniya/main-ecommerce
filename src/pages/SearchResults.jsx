import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Skeleton } from "../components/Skeleton";
import { ChevronRight } from "../components/Icons";
import "../styles/category.css"; // Reuse category styles

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) return;
        setLoading(true);
        fetch(`https://shopco-ecommerce-1-6ccc.onrender.com/products?search=${encodeURIComponent(query)}`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
            })
            .catch((err) => console.error("Search failed:", err))
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <div className="category-page" style={{ padding: "20px 50px" }}>
            <div className="breadcrumb">
                <Link to="/">Home</Link>
                <ChevronRight />
                <span>Search Results</span>
            </div>

            <h1 className="page-title">Results for "{query}"</h1>

            <div className="product-grid" style={{ marginTop: "30px" }}>
                {loading ? (
                    <Skeleton type="product-card" count={8} />
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="no-results">
                        <p>No products found matching your search.</p>
                        <Link to="/" className="btn-primary" style={{ marginTop: "20px", display: "inline-block" }}>
                            Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
