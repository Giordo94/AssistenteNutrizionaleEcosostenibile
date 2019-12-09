const mongoose = require('mongoose');

const Product = mongoose.model('Product');

/** Loads a product given its barcode */
exports.load_product = async (req, res) => {
  console.log(`Looking for barcode: ${req.query.barcode}...`); // DEBUG

  const query = { code: req.query.barcode };

  await Product.findOne(query)
    .exec()
    .then((product) => {
      if (product == null) {
        res.status(404).send({ description: 'Product not found' });
        console.log(`Product${req.query.barcode} not found`); // DEBUG
      } else {
        res.json(product);
        console.log(`Product found ->${product.barcode}`); // DEBUG
      }
    })
    .catch((err) => res.send(err));
};

/** Inserts a new product if not found in the database */
exports.insert_product = async (req, res) => {
  const query = { code: req.body.code };
  console.log(JSON.stringify(req.body.code)); // DEBUG

  // Prima di inserire il prodotto verifico che non sia già nel db
  await Product.findOne(query)
    .exec()
    .then((product) => {
      if (product == null) {
        console.log(`Product${req.body.barcode}not found -> Creating...`); // DEBUG
        // Se non trovo il prodotto ne creo uno nuovo
        this.createNewProduct(req, res);
      } else {
        // Se trovo il prodotto mando quello
        res.json(product);
        console.log(`Product found ->${JSON.stringify(product)}`); // DEBUG
      }
    })
    .catch((err) => res.send(err));
};

/** Creates a new product and inserts it in the database */
exports.createNewProduct = (req, res) => {
  const newProduct = new Product(req.body);
  console.log(JSON.stringify(newProduct)); // DEBUG

  newProduct.save()
    .then((product) => {
      console.log(`product created -> ${product}`); // DEBUG
      res.status(201).json(product);
    })
    .catch((err) => {
      console.log('error while creating new product'); // DEBUG
      res.send(err);
    });
};
