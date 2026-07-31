import { useState } from 'react';
import { API_URL } from '../../config'

export const Product = ({ product, onDelete, onUpdate, editingProductId, onEditProduct }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [image, setImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);


  const handleSave = () => {
    setIsLoading(true);
    setErrorMessage(null);

    const finalName = name.trim();
    const finalPrice = price ? Number(price) : 0;

    // створюю об'єкт форми, щоб передати дані і текст і фото
     const formData = new FormData();

     formData.append('name', finalName);
     formData.append('price', finalPrice);

     if(image) {
      formData.append('image', image);
     };

     if(removeImage) {
      formData.append('removeImage', 'true');
     }

    onUpdate(product.id, formData)
      .then(() =>{
        setName(finalName);
        setPrice(finalPrice);
        setImage(null);
        setRemoveImage(false)
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
    setImage(null);
    setRemoveImage(false);
    setErrorMessage(null);
  };

    return (
        <div className="product-card">
          {product.id === editingProductId ? (
            // режим редагування
            <div className="edit-mode">
                <h3>Редагування: {name}</h3>
                <img
                  src={
                    removeImage
                      ? `${API_URL}/images/no-image.jpg`
                      : image
                        ? URL.createObjectURL(image)
                        : (product.image 
                          ? `${API_URL}/images/${product.image}`
                          : `${API_URL}/images/no-image.jpg`)
                  }
                  alt={product.name}
                />
                <input
                    type="file"
                    accept="image/jpg, image/png, image/jpeg"
                    onChange={e => setImage(e.target.files[0])}
                />
                <label>
                  <input
                      type="checkbox"
                      checked={removeImage}
                      onChange={e => setRemoveImage(e.target.checked)}
                  />
                  Видалити фото
                </label>
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
                <img
                  src={product.image ? `${API_URL}/images/${product.image}` : `${API_URL}/images/no-image.jpg`}
                  alt={product.name}
                />
                <h3>{product.name}</h3>
                <p>Price: {product.price} грн.</p>
                <button onClick={() => onDelete(product.id)}>Видалити</button>
                <button onClick={() => onEditProduct(product.id)}>Редагувати</button>
            </div>
          )}
        </div>
    );
};
