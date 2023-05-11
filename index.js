import express from 'express';
import ProductManager from './desafio3.js';

const app = express();
const port = 8080;

const productManager = new ProductManager('products.json');

app.use(express.json());

app.get('/products', (req, res) => {
    const { limit } = req.query;
    let products = productManager.getProducts();
    
    if (limit) {
      const limitNum = parseInt(limit);
      products = products.slice(0, limitNum);
    }
    
    res.json(products);
  });

app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = productManager.getProductById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
}); 
  
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});