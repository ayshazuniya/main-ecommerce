
import "../styles/skeleton.css";

export const Skeleton = ({ type, count = 1 }) => {
    const skeletons = Array.from({ length: count }, (_, i) => i);

    if (type === "product-card") {
        return skeletons.map((n) => (
            <div className="skeleton-card" key={n}>
                <div className="skeleton-image pulse"></div>
                <div className="skeleton-text title pulse"></div>
                <div className="skeleton-text rating pulse"></div>
                <div className="skeleton-text price pulse"></div>
            </div>
        ));
    }

    if (type === "text") {
        return skeletons.map((n) => (
            <div className="skeleton-text pulse" key={n}></div>
        ));
    }

    return <div className="skeleton pulse"></div>;
};
