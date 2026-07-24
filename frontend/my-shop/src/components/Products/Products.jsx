import { Product } from './../Product/Product';

export const Products = ({ products, onDelete, onUpdate, editingProductId,onEditProduct }) => {
    return (
        <div>
            <h2>Products</h2>
            {products.map((product) => (
                <Product
                  key={product.id}
                  product={product}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  editingProductId={editingProductId}
                  onEditProduct={onEditProduct}
                />
            ))}
        </div>
    );
};
