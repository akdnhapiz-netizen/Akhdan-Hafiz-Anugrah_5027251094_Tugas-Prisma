const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server aktif dan berjalan di http://localhost:${PORT}`);
});