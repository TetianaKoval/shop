import express from 'express';
import rootRouter from './root.mjs';
import productsRouter from './products.mjs';

const router = express.Router();

router.use('/', rootRouter);
router.use('/products', productsRouter);

export default router;
