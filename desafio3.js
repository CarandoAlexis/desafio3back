const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    try {
      const data = fs.readFileSync(this.path);
      this.products = JSON.parse(data);
      this.currentId = this.products.reduce((acc, product) => Math.max(acc, product.id), 0);
    } catch (error) {
      this.products = [];
      this.currentId = 0;
    }
  }

  saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data);
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('Todos los campos son obligatorios');
    }

    if (this.products.some((product) => product.code === code)) {
      throw new Error('El código del producto ya existe');
    }

    const product = {
      id: ++this.currentId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(product);
    this.saveProducts();
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.path);
      return JSON.parse(data);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      console.error('Not Found');
      return null;
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      console.error('Not Found');
      return;
    }

    const product = this.products[productIndex];
    const updatedProduct = {
      ...product,
      ...updatedFields,
      id: product.id,
    };

    this.products.splice(productIndex, 1, updatedProduct);
    this.saveProducts();
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      console.error('Not Found');
      return;
    }

    this.products.splice(productIndex, 1);
    this.saveProducts();
  }
}
const productManager = new ProductManager('products.json');


module.exports = ProductManager;

/* Formato para agregar producto en JSON
productManager.addProduct(
    "Producto prueba 2",
    "Descripción del producto prueba 1",
    200,
    "Sin Imagen",
    "P2",
    200
);
*/

/* para actualizar un producto del JSON colocar id y despues especificar los parametros que se quieran cambiar
por ejemplo
productManager.updateProduct(1, {
    title: 'Nuevo título',
    description: 'Nueva descripción',
}); */


/*para ver productos del JSON en la consola
const products = productManager.getProducts();
console.log(products);
*/


/*para eliminar un producto simplemente escribir "productManager.deleteProduct()" con el id que deseamos eliminar;*/
