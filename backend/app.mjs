import './env.mjs';
import express from 'express';
import cors from 'cors';
import router from './routes/index.mjs';

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'

app.use(cors()); // Cross-Origin Resource Sharing — спільного використання ресурсів між різними джерелами
app.use(express.json());
app.use(express.static('public')); // дозвіл доступу до картинок

app.use(router);

app.listen(PORT, HOST, () => {
    console.log(`Server is working on port`);
    console.log(`local - http://localhost:${PORT}`);
    console.log(`network - http://127.0.0.1:${PORT}`);
});
