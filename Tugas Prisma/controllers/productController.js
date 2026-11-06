const prisma = require('./prisma');

exports.getAllProducts = async(req, res) => {
    try {
        const products = await prisma.product.findMany();
        return res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProductById = async(req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: 'ID harus berupa angka' });
        }

        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
        }

        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.createProduct = async(req, res) => {
    try {
        const { name, price, description } = req.body;

        // Skenario Validasi
        if (!name || price === undefined || price === null) {
            return res.status(400).json({
                success: false,
                message: 'Validasi gagal: name dan price wajib diisi'
            });
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({
                success: false,
                message: 'Validasi gagal: price harus berupa angka positif'
            });
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                price: parsedPrice,
                description: description || null
            }
        });

        return res.status(201).json({
            success: true,
            message: 'Produk berhasil ditambahkan',
            data: newProduct
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateProduct = async(req, res) => {
    try {
        const rawId = req.params.id || req.body.id;
        const id = parseInt(rawId);
        const { name, price, description } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Validasi gagal: ID wajib disertakan dan berupa angka'
            });
        }

        if (!name || price === undefined || price === null) {
            return res.status(400).json({
                success: false,
                message: 'Validasi gagal: name dan price wajib diisi'
            });
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({
                success: false,
                message: 'Validasi gagal: price harus berupa angka positif'
            });
        }

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: `Produk dengan ID ${id} tidak ditemukan`
            });
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                price: parsedPrice,
                description: description !== undefined ? description : existing.description
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Produk berhasil diperbarui',
            data: updatedProduct
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteProduct = async(req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Validasi gagal: ID harus berupa angka'
            });
        }

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: `Produk dengan ID ${id} tidak ditemukan`
            });
        }

        await prisma.product.delete({ where: { id } });

        return res.status(200).json({
            success: true,
            message: `Produk dengan ID ${id} berhasil dihapus`
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};