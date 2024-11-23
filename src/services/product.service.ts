import { Request, Response } from 'express';
import Products from '../models/product.model';
import IProduct from '../interfaces/product.interface';



class Product {
  constructor() { };

  /**
   * @desc Add new product
   */
  async create(req: Request, res: Response) {
    const { }: IProduct = req.body;

    try {
      await new Products(req.body)
        .save()
        .then((product: Buffer | any) => {
          res.status(201).json({
            status: true,
            message: "Product Added",
            product
          });
        })

    } catch (e: Error | any) {
      return res.status(500).json({
        status: false,
        message: `Something went wrong ${e.message}`
      })
    }
  }

  /**
   * @desc List all product in the catalogue
   */
  async list(req: Request, res: Response) {
    try {
      await Products.find()
        .then((product: Buffer | any) => {
          if (product.length !== 0) {
            return res.status(200).json({
              status: true,
              product
            });
          }
          res.status(206).json({
            message: "Catalogue is empty"
          });
        });
    } catch (e: Error | any) {
      return res.status(500).json({
        status: false,
        message: `Something went wrong ${e.message}`
      })
    }
  }

  /** 
   * @desc Update one **/
  async update(req: Request, res: Response) {
    const { }: IProduct = req.body;

    try {
      await Products.findByIdAndUpdate(req.params.id,
        { $set: req.body },
        { runValidators: true }) // Run validators upon updates
        .then((product: Object | Buffer | any) => {
          if (product) {

            return res.status(202).json({
              status: true,
              message: 'Product updated',
            })
          } else {
            return res.status(404).json({
              status: false,
              message: 'Product not found',
            });
          }
        })
        .catch((e: Error | any) => {

          // Error validation
          if (e.name === 'ValidationError') {

            if (e.errors['telephone']) {
              return res.status(406).json({
                status: false,
                message: e.errors['telephone'].message
              });
            } else if (e.errors['password']) {
              return res.status(406).json({
                status: false,
                message: e.errors['password'].message
              });

            } else if (e.errors['email']) {
              return res.status(406).json({
                status: false,
                message: e.errors['email'].message
              });
            }
          } else {
            return res.status(500).json({
              statusgaurd: false,
              message: e.name
            });
          }
        });
    } catch (e: any) {
      return res.status(503).json({
        status: false,
        message: e.message
      });
    }
  }

  /** 
   * @desc Delete Product**/
  async remove(req: Request, res: Response) {
    try {
      await Products.findByIdAndDelete(req.params.id)
        .then(async (product: Buffer | any) => {
          if (!product) {
            return res.status(404).json({
              status: false,
              message: 'Product not found'
            });
          }
          res.sendStatus(204);
        });
    } catch (e: Error | any) {
      res.status(500).json({
        status: false,
        message: `${e.message}`
      })
    }
  }

  /**
   * @desc View one product
   */
  async view(req: Request, res: Response) {
    try {
      await Products.findById(req.params.id,
        { _id: 0, createdAt: 0, updatedAt: 0 })
        .then((product: Object | Buffer | any) => {
          if (product) {

            return res.status(200).json({
              status: true,
              product,
            })
          } else {
            return res.status(404).json({
              status: false,
              message: 'Product not found',
            });
          }
        })
    }
    catch (e: Error | any) {
      return res.status(500).json({
        status: false,
        message: `Something went wrong ${e.name}`
      });
    }
  }
};

export default Product;