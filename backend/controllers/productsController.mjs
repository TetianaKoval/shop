import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('products.json');

export const getProductsHandler = async (req, res) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const products = JSON.parse(data);
        res.status(200).json(products);
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
        const data = await fs.readFile(filePath, 'utf-8');

        const products = JSON.parse(data);

        if (!name || name.trim() === '') {
          return res.status(400).json({message: `Назва товару обо'язкова`})
        }

        if (isNaN(Number(price)) || Number(price) <= -1) {
            return res.status(400).json({ message: 'Некоректна ціна' });
        }

        // перевірка на дублікати

        const isDublicate = products.some(product => product.name.toLowerCase() === name.toLowerCase());
        if(isDublicate) {
          return res.status(409).json({message: 'товар з такою назвою вже існує'})
        }

        const imageName = req.file ? req.file.filename : null;

        const newProduct = {
            id: Date.now(),
            name: name.trim(),
            price: Number(price),
            image: imageName,
        };
        products.push(newProduct);

        //затримка для перевірки повільної роботи сервера
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(3000);

        await fs.writeFile(filePath, JSON.stringify(products, null, 2));

        res.status(200).json(products);
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
    // читаєм вміст файлу product.json і записуєм у змінну
    const data = await fs.readFile(filePath, 'utf-8');
    // перетворюю data, які у вигляді рядка, в js об'єкт
    let products = JSON.parse(data);
    
    //шукаю індекс товару серед продуктів, щоб він співпадав з індексом, що прийшов з параметрів
    const index = products.findIndex(product => product.id === productId);
    
    if (index === -1) {
      return res.status(404).json({message: 'товар не знайдено'})
    };
    
    //оновлюєм товар
    products[index] = {
      ...products[index], //переносим всі дані з об'єкта товару, які є.
      name: name || products[index].name, // заміняєм назву товару якщо вона прийшла в запиті
      price: price !== undefined ? Number(price): products[index].price // перевіряєм ціну. Якщо вона не прийшла і не 0, тобто 0 !== underfined, то тоді заміняєм
    };

    //затримка для перевірки повільної роботи сервера
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(3000);

    // записуєм оновлений список у файл
      await fs.writeFile(filePath, JSON.stringify(products, null, 2));

      res.status(200).json({
      message: 'товар успішно додано',
      updatedProduct: products[index],
      });
  } catch (error) {
    console.error('помилка оновлення товару:', error);
    res.status(500).json({message: `помилка сервера: controllers -> productsControllers.mjs -> updateSingleProductHandler ${error}`})
  }
}

