import { Request, Response } from "express";
import crypto from 'crypto';
// import sendSMS from "./sms.service";
import Users from "../models/user.model";
import IUser from "../interfaces/user.interface";
import { hashSync, compareSync } from "bcryptjs";
import Guard from "../middlewares/authentication.middleware";
import AppConfig from "../config/app.config";
import Orders from "../models/order.model";
import Transactions from "../models/transaction.model";


const jwt = new Guard;

/**
 * Gassed User Operations
 */
class UserProfile {

  private userID: any;
  private Customer: any;

  constructor() { this.profileInfo };

  /**
   * @returns {String} 4 digit verification code
   */
  verificationCode() {
    return crypto.randomBytes(2).toString('hex').toUpperCase();
  }

  /**
   * Creates a new user
   * @param {Request} req - User form body params
   * @returns {Response} Http response
  */
  create = async (req: Request, res: Response) => {

    const { stateResidence, homeAddress, telephone } = req.body;
    try {

      // Check if customer exists
      await Users.find({ telephone })
        .then((user: any) => {

          if (user.length == 0) {
            const newUser = new Users(req.body);
            newUser.vCode = this.verificationCode();
            newUser.save().then(data => {

              // Send verification code via SMS to user
              // sendSMS(newUser.telephone, '_VERIFICATION', newUser.vCode);
              return res.status(201).json({
                status: true,
                user: data._id,
                vCode: data.vCode,
                message: "Verification Code sent"
              });

              // Checking for validation errors
            }).catch((e: any) => {
              if (e.name === 'ValidationError') {
                if (e.errors['telephone']) {
                  return res.status(406).json({
                    status: false,
                    message: e.errors['telephone'].message
                  });
                }
              }
            });
          } else {
            return res.status(409).json({
              status: false,
              message: 'Error: User already exist'
            });
          }
        });
    }
    catch (e: any) {
      return res.status(500).json({
        status: false,
        message: e.message
      })
    }
  }

  /**
   * Validate verification code
   */
  verify = async (req: Request, res: Response) => {
    try {

      // Checking if user exists
      const newUser: any = await Users.findById(req.params.id).exec();

      // Verification code validation
      if (newUser.vCode === req.body.vCode) {
        Users.findByIdAndUpdate(req.params.id, {
          $set: { isVerified: true },
          $unset: { vCode: '' } // Remove this field
        })
          .then((user: any) => {
            return res.status(202).json({
              status: true,
              user: "User verified!"
            });
          })
      } else {
        res.status(406).json({
          status: false,
          message: 'FAILED: Invalid code. Try again!'
        })
      }

    } catch (e: any) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      })
    }
  }

  /**
   * Fetch user profile
   */
  profileInfo = async (req: Request, res: Response) => {

    this.userID = res.locals.payload._id;  // Serialized JWToken
    try {
      await Users.findById(this.userID, {
        password: 0,
        pin: 0,
        createdAt: 0,
        updatedAt: 0,
        isVerified: 0,
        _id: 0,
        __v: 0
      }).then((user: any) => {
        return res.status(200).json({
          status: true,
          user
        });
      }).catch((err) => {
        return res.status(404).json({
          status: false,
          message: 'User not found'
        })
      })
    }
    catch (e: any) {
      res.status(403).json({
        status: false,
        message: e.name
      })
    }
  };

  /**
   * Modify user profile information
   */
  updateProfile = async (req: Request, res: Response) => {

    // Validating profile update route
    if (!req.params.id) {

      this.userID = res.locals.payload._id;  // Serialized JWToken
      const {
        firstName,
        lastName,
        telephone,
        email,
        stateResidence,
        homeAddress,
        password
      }: IUser = req.body;

      // Encrypting sensitive information
      (password) ? req.body.password = hashSync(password, 3) : {};
    }
    else {
      const { firstName, lastName, email, password }: IUser = req.body;
      this.userID = req.params.id;

      // Validating length of password
      if (req.body.password.length < 6) {
        return res.status(400).json({
          status: false,
          message: "Password is too short"
        });
      }

      // Encrypting sensitive information
      (password) ? req.body.password = hashSync(password, 3) : {};
    }

    this.Customer = req.body;

    try {
      await Users.findByIdAndUpdate(this.userID,
        { $set: this.Customer },
        { runValidators: true }) // Run validators upon updates
        .then((data: Object | Buffer | any) => {
          if (data) {

            return res.status(202).json({
              status: true,
              message: 'Profile updated',
            })
          } else {
            return res.status(404).json({
              status: false,
              message: 'User not found',
            });
          }
        }).catch((e: any) => {

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
              status: false,
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
  };

  /**
   * Delete Account
   */
  deleteAccount = async (req: Request, res: Response) => {

    this.userID = res.locals.payload._id;  // Serialized JWToken

    try {
      await Users.findByIdAndDelete(this.userID)
        .then(async (user: object | Buffer | any) => {
          if (!user) {
            return res.status(404).json({
              status: false,
              message: 'User not found'
            });
          }

          // Removing orders and transaction history
          await Orders.deleteMany({ user: this.userID })
            .then(async () => {
              await Transactions.deleteMany({ user: this.userID })
                .then(() => {
                  return res.sendStatus(204)
                })
            });
        });
    } catch (e: any) {
      res.status(500).json({
        status: false,
        message: `${e.message}`
      })
    }
  };

  /**
   * User Login
   */
  login = async (req: Request, res: Response) => {
    const { telephone, password } = req.body;

    try {
      await Users.findOne({ telephone }, {
        _id: 1,
        password: 1,
        isVerified: 1,
        firstName: 1
      })
        .then((user: Object | Buffer | any) => {

          // Checking if user exists
          if (user) {

            // validating password
            if (compareSync(password, user.password)) {
              user.password = undefined

              // Generate User Authorization Token
              let token = jwt.SIGN_AUTH_TOKEN(user, AppConfig.JWT_TOKEN);
              return res.status(200).json({
                status: true,
                isLoggedIn: true,
                firstName: user.firstName,
                token
              });
            } else {
              res.status(406).json({
                status: false,
                message: "Invalid phone or password"
              })
            }
          }
          else {
            return res.status(404).json({
              message: `ERROR: User not found`
            });
          }
        })
    } catch (e: any) {
      return res.status(406).json({
        status: false,
        message: 'Complete your registion to continue'
      })
    }
  }
}

export default UserProfile;