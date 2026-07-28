import fs from 'fs/promises';
import path from 'path';
import { pool } from '../db.mjs';

const filePath = path.resolve('products.json');

export const getProductsHandler = async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM products');
        res.status(200).json(data.rows);
    } catch (err) {
        console.error('Помилка:', err);
        res.status(500).json({ message: 'Помилка сервера' });
    }
};

export const postProductsHandler = async (req, res) => {
  console.log('Дані форми', req.body);
  console.log('завантажений файл', req.file)
    try {
        const { name, price } = req.body;
        if (!name || name.trim() === '') {
          return res.status(400).json({message: `Назва товару обо'язкова`})
        }

        if (isNaN(Number(price)) || Number(price) <= -1) {
            return res.status(400).json({ message: 'Некоректна ціна' });
        }

        // перевірка на дублікати
        const isDublicate = await pool.query('SELECT * FROM products WHERE LOWER(name) = LOWER($1)', [name]);

        if(isDublicate.rows.length > 0) {
          return res.status(409).json({message: 'товар з такою назвою вже існує'})
        };

        const imageName = req.file ? req.file.filename : null;

        const newProduct = {
            name: name.trim(),
            price: Number(price),
            image: imageName,
        };

        const product = await pool.query('INSERT INTO products (name, price, image) VALUES ($1, $2, $3) RETURNING *', [newProduct.name, newProduct.price, newProduct.image]);

        console.log(product.rows);

        const data = await pool.query('SELECT * FROM products');
        //затримка для перевірки повільної роботи сервера
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(3000);

        res.status(200).json(data.rows);
    } catch (error) {
        console.error('Помилка', error);
        res.status(500).json({ message: 'помилка сервера' });
    }
};

export const getSingleProductHandler = (req, res) => {
    res.send(`Get single comment with id: ${req.params.productId}`);
};

export const deleteSingleProductHandler = async (req, res) => {
    // res.send(`Delete single comment with id: ${req.params.productId}`);
    try {
        const productIdForDelete = parseInt(req.params.productId);
        const data = await fs.readFile(filePath, 'utf-8');

        const products = JSON.parse(data);

        const productExists = products.find(product => product.id === productIdForDelete);

        if (!productExists) {
          return res.status(404).json({message: 'Товар не знайдено, не можливо видалити'})
        }

        if(productExists.image) {
          const linkImageDelete = 'public/images/' + productExists.image;
          try {
            await fs.unlink(linkImageDelete)
          } catch (error) {
            console.error('Фото товару не вдалось видалити:', error)
          }
        }

        const filteredProducts = products.filter(
            (product) => product.id !== productIdForDelete,
        );
        await fs.writeFile(filePath, JSON.stringify(filteredProducts, null, 2));

        res.status(200).json(filteredProducts);
    } catch (error) {
        console.error('Помилка', error);
        res.status(500).json({ message: 'помилка сервера' });
    }
};

export const updateSingleProductHandler = async (req, res) => {
  try {
    // з параметрів отримуєм ID -> router.put('/:productId', updateSingleProductHandler);
    const productId = Number(req.params.productId);
    
    // із тіла запиту отримуєм назву і ціну. Це те що прислав React
    const { name, price } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({message: `Назва товару обо'язкова`})
    }
    
    if (isNaN(Number(price)) || Number(price) <= -1) {
      // alert('Будь ласка, введіть числове додатнє значення ціни');
      return res.status(400).json({ message: 'Некоректна ціна' });
    }

    // перевірка на дублікати
    const isDublicate = await pool.query('SELECT * FROM products WHERE LOWER(name) = LOWER($1) AND id != $2', [name, productId]);

    if(isDublicate.rows.length > 0) {
      return res.status(409).json({message: 'товар з такою назвою вже існує'})
    };

    const data = await pool.query('UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *', [name, price, productId]);

    //затримка для перевірки повільної роботи сервера
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(3000);

    if(data.rows.length === 0){
      return res.status(404).json({message: 'товар не знайдено'});
    };
    // console.log(`товар успішно додано`, data.rows[0])

    res.status(200).json({
    message: 'товар успішно додано',
    updatedProduct: data.rows[0],
    });
  } catch (error) {
    console.error('помилка оновлення товару:', error);
    res.status(500).json({message: `помилка сервера: controllers -> productsControllers.mjs -> updateSingleProductHandler ${error}`})
  }
}

