import { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { Products } from './components/Products/Products';
import './App.scss';
import { API_URL } from './config'
import { AddProductForm } from './components/AddProductForm/AddProductForm';

const App = () => {
    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const [productsError, setProductsError] = useState(null);
    console.log(API_URL)



    useEffect(() => {
        fetch(`${API_URL}/products`)
            .then((res) => res.json())
            .then((data) => {
              setProducts(data);
              setProductsError(null);
            })
            .catch((err) => {
                console.error('Сервер не відповів:', err);
                setProductsError('Сервер не відповідає');
            });
    }, []);

    const handleProductAdd = (newProductData) => {
      // тут передається formData тому headers не потрібно предавати і в body передається сам об'єкт newProductData
      return fetch(`${API_URL}/products`, {
        method: 'POST',
        body: newProductData,
      })
      .then((res) => {
        if(res.ok) {
          return res.json();
        } else {
          return res.json().then(errData => {
            throw new Error(errData.message || 'помилка створення товару на сервері')
          });
        };
      })
      .then((updatedProducts) => setProducts(updatedProducts))
      .catch((err) => {
        console.error('Не вдалось додати товар', err);
        throw err;
      })
    }

    const handleProductDelete = (id) => {
        fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (res.ok) {
                    setProducts(
                        products.filter((product) => product.id !== id),
                    );
                    setProductsError(null);
                } else {
                    setProductsError('Не вдалося видалити товар на сервері');
                }
            })
            .catch((err) => {
              setProductsError('Не вдалось видалити товар');
              console.error('Помилка при видаленні', err)
            });
    };

    const handleProductUpdate = (id, updatedData) => {
      // тут я використовую return для то того, щоб обробляти помилку при відкритій формі редагування у файлі Product.jsx у функції handleSave
      return fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })
          .then(res => {
             if (res.ok) {
                return res.json(); // якщо все ок то йдем в наступний then
             } else {
              return res.json().then((errData) => {
                 throw new Error(errData.message || 'Помилка оновлення') // якщо сервер вернув помилку то прокидаєм цю помпилку в catch
              });
             }
          })
          .then(data => {
            setProducts(products.map(product => product.id === id ? data.updatedProduct : product))
          })
          .catch(err => {
            console.error('не вдалось оновити товар в handleProductUpdate у файлі App.jsx', err.message || err);
            // alert(err.message || err)
            throw err;
          });
    }

    return (
        <div className="App">
            <Header />
            <h1>My shop</h1>
            {productsError && (
                <div>{productsError}</div>
            )}
            <Products
              products={products}
              onDelete={handleProductDelete}
              onUpdate={handleProductUpdate}
              editingProductId={editingProductId}
              onEditProduct={setEditingProductId}
            />
            <AddProductForm
              onAdd={handleProductAdd}
              editingProductId={editingProductId}
              hasServerError={!!productsError}
            />
        </div>
    );
};

export default App;
