import express from 'express';
import upload from '../middleware/upload.mjs';
import {
    getProductsHandler,
    postProductsHandler,
    getSingleProductHandler,
    deleteSingleProductHandler,
    updateSingleProductHandler
} from './../controllers/productsController.mjs';

const router = express.Router();

router.get('/', getProductsHandler);
router.post('/', upload.single('image'), postProductsHandler);
router.get('/:productId', getSingleProductHandler);
router.delete('/:productId', deleteSingleProductHandler);
router.put('/:productId', updateSingleProductHandler);

export default router;
