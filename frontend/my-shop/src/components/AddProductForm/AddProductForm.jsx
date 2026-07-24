import { useState } from 'react';

export const AddProductForm = ({ onAdd, editingProductId, hasServerError }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);

    const isFormDisabled = isLoading || editingProductId !== null || hasServerError;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const numericPrice = Number(price);

        if (!name.trim() || !price) {
            setError('Заповніть всі поля');
            return;
        }

        if (isNaN(numericPrice) || numericPrice <= -1) {
            setError('Ціна повинна бути додатнім числом');
            return;
        }

        setIsLoading(true);
        try {
          const formData = new FormData();

          formData.append('name', name.trim());
          formData.append('price', numericPrice);

          if(file) {
            formData.append('image', file);
          }

          await onAdd(formData);

          setName('');
          setPrice('');
          setFile(null);
          e.target.reset();
        } catch (err) {
          setError(err.message || 'не вдалось створити товар');
        } finally {
          setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Додати товар</h2>
            <input
                type="text"
                placeholder="Назва товару"
                value={name}
                disabled={isFormDisabled}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="text"
                placeholder="Ціна товару"
                value={price}
                disabled={isFormDisabled}
                min="1"
                step="0.01"
                onChange={(e) => {
                    const val = e.target.value;

                    if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                        setPrice(val);
                    }
                }}
            />

            <div style={{ margin: '10px 0' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>Фото товару:</label>
              <input
                type="file"
                accept='image/png, image/jpg, image/jpeg'
                disabled={isFormDisabled}
                onChange={(e) => {
                  setFile(e.target.files[0])
                }}
              />
            </div>

            {error && (
              <div>{error}</div>
            )}

            <button
              type={'submit'}
              disabled={isFormDisabled}
            >
              {isLoading ? 'Створення...' : 'Додати'}
            </button>
        </form>
    );
};
