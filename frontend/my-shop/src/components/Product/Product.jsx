import { useState } from 'react';
import { API_URL } from '../../config'

export const Product = ({ product, onDelete, onUpdate, editingProductId, onEditProduct }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);


  const handleSave = () => {
    setIsLoading(true);
    setErrorMessage(null);

    const finalName = name.trim() // || product.name;
    const finalPrice = price ? Number(price) : 0;

    onUpdate(product.id, {name: finalName, price: finalPrice})
    .then(() =>{
      setName(finalName);
      setPrice(finalPrice);
      onEditProduct(null);
    })
    .catch((err) => {
      setErrorMessage(err.message || 'Сталася помилка при збереженні')
    })
    .finally(() => setIsLoading(false))
  };

  const handleCancel = () => {
    onEditProduct(null);
    setName(product.name);
    setPrice(product.price);
    setErrorMessage(null)
  };

    return (
        <div className="product-card">
          {product.id === editingProductId ? (
            // режим редагування
            <div className="edit-mode">
                <h3>Редагування: {name}</h3>
                {product.image && (
                  <img src={`${API_URL}/images/${product.image}`} alt={product.name} />
                )}
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                {errorMessage && (
                  <div>{errorMessage}</div>
                )}
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ?  'Збереження' : 'Зберегти'}
                </button>
                <button onClick={handleCancel}>Відміна</button>
            </div>
          ) : (
            // статичний режим
            <div className="view-mode">
                {product.image && (
                  <img src={`${API_URL}/images/${product.image}`} alt={product.name} />
                )}
                <h3>{product.name}</h3>
                <p>Price: {product.price} грн.</p>
                <button onClick={() => onDelete(product.id)}>Видалити</button>
                <button onClick={() => onEditProduct(product.id)}>Редагувати</button>
            </div>
          )}
        </div>
    );
};
