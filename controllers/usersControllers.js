const { users, calorieTrackers, weightMeasures } = require('../models');
require('dotenv').config();
const Joi = require('joi');
const moment = require('moment');
const { generateToken, getUserdata } = require('../helper/jwt');
const { encrypt, comparePass } = require('../helper/bcrypt');
const verify = require('../helper/googleHelper');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');    
moment.suppressDeprecationWarnings = true;


module.exports = {
  signup: async (req, res) => {
    const body = req.body

    try {
      const schema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(6).max(12).required(),
        calorieSize: Joi.number().min(1000).max(2000).required(),
        weight: Joi.number().required(),
        height: Joi.number().required(),
        waistline: Joi.number().required(),
        thigh: Joi.number().required()
      })

      const check = schema.validate({
        fullName: body.fullName,
        email: body.email,
        password: body.password,
        calorieSize: body.calorieSize,
        weight: body.weight,
        height: body.height,
        waistline: body.waistline,
        thigh: body.thigh
      }, { abortEarly: false });

      if (check.error) {
        return res.status(400).json({
          status: "failed",
          message: "bad request",
          errors: check.error["details"].map(({ message }) => message)
        });
      }

      const checkEmail = await users.findOne({
        where: {
          email: body.email
        }
      });

      if (checkEmail) {
        return res.status(400).json({
          status: "failed",
          message: "email already use, please use another email"
        })
      };

      const userCheck = await users.create({
        fullName: body.fullName,
        email: body.email,
        password: encrypt(body.password),
        [req.file ? "profilePic" : null]: req.file ? req.file.path : null,
        [req.file ? "cover" : null]: req.file ? req.file.path : null,
        height: body.height,
        earlyWeight: body.weight,
        calorieSize: body.calorieSize,
        progress: 0,
        BMI: Math.round(body.weight / ((body.height / 100) ** 2))
      });

      const createCalorieSize = await calorieTrackers.create({
        userId: userCheck.dataValues.id,
        calConsumed: 0,
        remainCalSize: body.calorieSize,
        date: moment(new Date()).local().format("YYYY-M-D")
      });

      const createWeightMeasure = await weightMeasures.create({
        userId: userCheck.dataValues.id,
        weight: body.weight,
        waistline: body.waistline,
        thigh: body.thigh,
        date: moment(new Date()).local().format("YYYY-M-D")
      })


      const payload = {
        role: userCheck.dataValues.role,
        email: userCheck.dataValues.email,
        id: userCheck.dataValues.id
      };

      const token = generateToken(payload);

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_ADMIN,
          pass: process.env.PASS_ADMIN
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_ADMIN,
        to: body.email,
        subject: 'Verified Your Email',
        html: `<!DOCTYPE html>
                <html>
                <head>
                
                  <meta charset="utf-8">
                  <meta http-equiv="x-ua-compatible" content="ie=edge">
                  <title>Email Confirmation</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style type="text/css">
                  
                  @media screen {
                    @font-face {
                      font-family: 'Source Sans Pro';
                      font-style: normal;
                      font-weight: 400;
                      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                    }
                
                    @font-face {
                      font-family: 'Source Sans Pro';
                      font-style: normal;
                      font-weight: 700;
                      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                    }
                  }
                
                  
                  body,
                  table,
                  td,
                  a {
                    -ms-text-size-adjust: 100%; /* 1 */
                    -webkit-text-size-adjust: 100%; /* 2 */
                  }
                
                  
                  table,
                  td {
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                  }
                
                  
                  img {
                    -ms-interpolation-mode: bicubic;
                  }
                
                  
                  a[x-apple-data-detectors] {
                    font-family: inherit !important;
                    font-size: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                    color: inherit !important;
                    text-decoration: none !important;
                  }
                

                  div[style*="margin: 16px 0;"] {
                    margin: 0 !important;
                  }
                
                  body {
                    width: 100% !important;
                    height: 100% !important;
                    padding: 0 !important;
                    margin: 0 !important;
                  }
                
                  
                  table {
                    border-collapse: collapse !important;
                  }
                
                  a {
                    color: #1a82e2;
                  }
                
                  img {
                    height: auto;
                    line-height: 100%;
                    text-decoration: none;
                    border: 0;
                    outline: none;
                  }
                  </style>
                
                </head>
                <body style="background-color: #e9ecef;">
                
                  <!-- start preheader -->
                  
                  <!-- end preheader -->
                
                  <!-- start body -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                
                    <!-- start logo -->
                    <tr>
                      <td align="center" bgcolor="#e9ecef">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                          <tr>
                            <td align="center" bgcolor="#ffffff" valign="top" style="padding: 24px;">
                              <a  target="_blank" style="display: inline-block;">
                                <img src="https://res.cloudinary.com/dejongos/image/upload/v1635408053/cover/logo-diet-on_yx4o8s.png" alt="Logo" border="0" width="48" style="display: block; width: 150px; max-width: 150px; min-width: 150px;">
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <!-- end logo -->
                
                    <!-- start hero -->
                    <tr>
                      <td align="center" bgcolor="#e9ecef">
                        <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                          <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
                            </td>
                          </tr>
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                      </td>
                    </tr>
                    <!-- end hero -->
                
                    <!-- start copy block -->
                    <tr>
                      <td align="center" bgcolor="#e9ecef">
                        <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                
                          <!-- start copy -->
                          <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                              <p style="margin: 0;">Tap the button below to confirm your email address. If you didn't create an account, you can safely delete this email.</p>
                            </td>
                          </tr>
                          <!-- end copy -->
                
                          <!-- start button -->
                          <tr>
                            <td align="left" bgcolor="#ffffff">
                              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                          <a href="https://test-diet.herokuapp.com/v1/users/verifiedaccount/${payload.id}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Verified Your Account</a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <!-- end button -->
                
                          <!-- start copy -->
                          <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                              <p style="margin: 0;">If that doesn't work, please refresh your email</p>
                            </td>
                          </tr>
                          <!-- end copy -->
                
                          <!-- start copy -->
                          <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                              <p style="margin: 0;">Best Regards,<br> Admin Diet On</p>
                            </td>
                          </tr>
                          <!-- end copy -->
                
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                      </td>
                    </tr>
                    <!-- end copy block -->
                
                    <!-- start footer -->
                    <tr>
                      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                        <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                
                          <!-- start permission -->
                          <tr>
                            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                              <p style="margin: 0;">You received this email because we received a request verified for your account. If you didn't request you can safely delete this email.</p>
                            </td>
                          </tr>
                          <!-- end permission -->
                
                          <!-- start unsubscribe -->
                          <!-- end unsubscribe -->
                
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                      </td>
                    </tr>
                    <!-- end footer -->
                
                  </table>
                  <!-- end body -->
                
                </body>
                </html>`
      };

            let Email = ""

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    Email = "Email Sent"
                }
            });

            return res.status(200).json({
                status: "success",
                message: "sign up successfully, and please check your email to verified",
                token: token,
                dataUser: userCheck,
                dataCalorie: createCalorieSize,
                dataWeight: createWeightMeasure,
                email_status : Email
            });

        } catch (error) {
            console.log("🚀 ~ file: usersControllers.js ~ line 79 ~ signup: ~ error", error)
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error",
            });
        }
  },

  signin: async (req, res) => {
    const body = req.body

    try {
      const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
      });

      const check = schema.validate({
        email: body.email,
        password: body.password
      }, { abortEarly: false });

      if (check.error) {
        return res.status(400).json({
          status: "failed",
          message: "bad request",
          errors: check.error["details"].map(({ message }) => message)
        });
      }

      const userEmailData = await users.findOne({
        where: {
          email: body.email
        }
      })

      if (!userEmailData) {
        return res.status(400).json({
          status: "failed",
          message: "invalid email"
        })
      }

      const checkPass = comparePass(body.password, userEmailData.dataValues.password)

      if (!checkPass) {
        return res.status(400).json({
          status: "failed",
          message: "wrong password"
        })
      }

      if (userEmailData.dataValues.isVerified === false) {
        return res.status(400).json({
          status: "failed",
          message: "please verified your email first"
        })
      }

      const payload = {
        role: userEmailData.dataValues.role,
        email: userEmailData.dataValues.email,
        id: userEmailData.dataValues.id
      }

      const token = generateToken(payload)

      return res.status(200).json({
        status: "success",
        message: "sign in successfully",
        token: token
      })

    } catch (error) {
      console.log("🚀 ~ file: usersControllers.js ~ line 444 ~ signin: ~ error", error)
      return res.status(500).json({
        status: "failed",
        message: "internal server error"
      })
    }
  },

  delete: async (req, res) => {
    const id = req.params.id

    try {
      const dataToken = req.users;
      console.log("🚀 ~ file: usersControllers.js ~ line 157 ~ delete: ~ dataToken", dataToken)

      const userData = await users.findOne({
        where: {
          id: id
        }
      })

      if (!userData) {
        return res.status(400).json({
          status: "failed",
          message: "data not found"
        })
      };

      if (userData.id !== dataToken.id) {
        return res.status(401).json({
          status: "failed",
          message: "not authorize"
        })
      }

      const dataUser = await users.destroy({
        where: {
          id: id
        }
      })

      return res.status(200).json({
        status: "success",
        message: "data has been deleted"
      })
    } catch (error) {
      console.log("🚀 ~ file: usersControllers.js ~ line 189 ~ delete: ~ error", error)
      return res.status(500).json({
        status: "failed",
        message: "Internal Server Error"
      })
    }
  },

  updateUserProfile: async (req, res) => {
    const body = req.body;

    try {
      const schema = Joi.object({
        fullName: Joi.string(),
        password: Joi.string().min(6).max(12),
        profilePic: Joi.string(),
        cover: Joi.string(),
        height: Joi.number()
      })

      const check = schema.validate({
        fullName: body.fullName,
        password: body.password,
        profilePic: req.file ? req.file.path : "profilePic",
        cover: req.file ? req.file.path : "cover",
        height: body.height
      }, { abortEarly: false });

      if (check.error) {
        return res.status(400).json({
          status: "failed",
          message: "Bad Request",
          errors: error["details"].map(({ message }) => message)
        })
      };

      const dataUser = await users.findOne({
        where: {
          id: req.users.id
        }
      })

      if (!dataUser) {
        return res.status(400).json({
          status: " failed",
          message: "data not found"
        })
      }

      if (body.password) {
        const dataUser = await users.findOne({
          where: {
            id: req.users.id
          }
        });

        const checkPass = comparePass(body.password, dataUser.dataValues.password)

        if (checkPass) {
          return res.status(400).json({
            status: "failed",
            message: "please add another password"
          })
        }

        await users.update({
          password: encrypt(body.password)
        }, {
          where: {
            id: req.users.id
          }
        })
      };

      const updateUser = await users.update({
        fullName: body.fullName,
        [req.file ? "profilePic" : null]: req.file ? req.file.path : null,
        [req.file ? "cover" : null]: req.file ? req.file.path : null,
        height: body.height
      },
        {
          where: {
            id: req.users.id
          }
        });

      if (!updateUser) {
        return res.status(400).json({
          status: "failed",
          message: "unable to input the data"
        })
      };

      const userFinalUpdate = await users.findOne({
        where: {
          id: req.users.id
        }
      })

      return res.status(200).json({
        status: "success",
        message: "update successfully",
        data: userFinalUpdate
      });

    } catch (error) {
      console.log("🚀 ~ file: usersControllers.js ~ line 316 ~ update: ~ error", error)
      return res.status(500).json({
        status: "failed",
        message: "Internal Server Error"
      })
    }
  },

  getUserById: async (req, res) => {

    try {
      const dataToken = req.users

      const profileUser = await users.findOne({
        where: {
          id: req.users.id
        },

      });

      if (!profileUser) {
        return res.status(400).json({
          status: "failed",
          message: "data not found"
        })
      };

      if (profileUser.id !== dataToken.id) {
        return res.status(400).json({
          status: "failed",
          message: "not authorize"
        })
      };

      return res.status(200).json({
        status: "success",
        message: "successfully retrieved data",
        data: profileUser
      })
    } catch (error) {
      console.log("🚀 ~ file: usersControllers.js ~ line 326 ~ getUserById: ~ error", error)
      return res.status(500).json({
        status: "failed",
        message: "Internal Server Error"
      })
    }
  },

  getAllUser: async (req, res) => {
    try {
      const getAll = await users.findAll()

      return res.status(200).json({
        status: "success",
        message: "success retrieved data",
        data: getAll
      })
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: "Internal Server Error"
      })
    }
  },

  verifiedAccount: async (req, res) => {
    const id = req.params.id

    try {

      const checkUser = await users.findOne({
        where: {
          id: id
        }
      })

      if (!checkUser) {
        return res.status(400).json({
          status: "failed",
          message: "data not found"
        })
      }

      await users.update({
        isVerified: true
      },
        {
          where: {
            id: id
          }
        })

      return res.status(200).json({
        status: "success",
        message: "successfully verified, please sign in again"
      })
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: "Internal Server Error",
      });
    }

  },

  forgotPass: async (req, res) => {
    const body = req.body

    try {
      const schema = Joi.object({
        email: Joi.string().required(),
      })

      const check = schema.validate({
        email: body.email
      }, { abortEarly: false });

      if (check.error) {
        return res.status(400).json({
          status: "failed",
          message: "bad request",
          error: check.error["details"].map(({ message }) => message)
        });
      }

      const checkUser = await users.findOne({
        where: {
          email: body.email
        }
      })

      if (!checkUser) {
        return res.status(400).json({
          status: "failed",
          message: "please register first"
        })
      }

      if (checkUser.dataValues.isVerified === false) {
        return res.status(400).json({
          status: "failed",
          message: "please verified your account first"
        })
      }

      const passReset = randomstring.generate({
        length: 12,
        charset: 'hex'
      });

      const resetPass = await users.update({
        password: encrypt(passReset)
      },
        {
          where: {
            email: body.email
          }
        })

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_ADMIN,
          pass: process.env.PASS_ADMIN
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_ADMIN,
        to: body.email,
        subject: 'Reset Password',
        html: `<!DOCTYPE html>
                <html>
                <head>
                
                  <meta charset="utf-8">
                  <meta http-equiv="x-ua-compatible" content="ie=edge">
                  <title>Reset Password</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style type="text/css">
                  
                  @media screen {
                    @font-face {
                      font-family: 'Source Sans Pro';
                      font-style: normal;
                      font-weight: 400;
                      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                    }
                
                    @font-face {
                      font-family: 'Source Sans Pro';
                      font-style: normal;
                      font-weight: 700;
                      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                    }
                  }
                
                  
                  body,
                  table,
                  td,
                  a {
                    -ms-text-size-adjust: 100%; /* 1 */
                    -webkit-text-size-adjust: 100%; /* 2 */
                  }
                
                  
                  table,
                  td {
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                  }
                
                  
                  img {
                    -ms-interpolation-mode: bicubic;
                  }
                
                  
                  a[x-apple-data-detectors] {
                    font-family: inherit !important;
                    font-size: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                    color: inherit !important;
                    text-decoration: none !important;
                  }
                
                 
                  div[style*="margin: 16px 0;"] {
                    margin: 0 !important;
                  }
                
                  body {
                    width: 100% !important;
                    height: 100% !important;
                    padding: 0 !important;
                    margin: 0 !important;
                  }
                
                  
                  table {
                    border-collapse: collapse !important;
                  }
                
                  a {
                    color: #1a82e2;
                  }
                
                  img {
                    height: auto;
                    line-height: 100%;
                    text-decoration: none;
                    border: 0;
                    outline: none;
                  }
                  </style>
                
                </head>
                <body style="background-color: #e9ecef;">
                
                  <!-- start preheader -->
                  
                  <!-- end preheader -->
                
                  <!-- start body -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                
                    <!-- start logo -->
                    <tr>
                      <td align="center" bgcolor="#e9ecef">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                          <tr>
                            <td align="center" bgcolor="#ffffff" valign="top" style="padding: 24px;">
                              <a  target="_blank" style="display: inline-block;">
                                <img src="https://res.cloudinary.com/dejongos/image/upload/v1635408053/cover/logo-diet-on_yx4o8s.png" alt="Logo" border="0" width="48" style="display: block; width: 150px; max-width: 150px; min-width: 150px;">
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <!-- end logo -->
                
                    <!-- start hero -->
                    <tr>
                      <td align="center" bgcolor="#e9ecef">
                        <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                          <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Reset Password</h1>
                            </td>
                          </tr>
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                      </td>
                    </tr>
                    <!-- end hero -->
                
                    <!-- start copy block -->
                    <tr>
                      <td align="center" bgcolor="#e9ecef">
                        <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                
                          <!-- start copy -->
                          <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                              <p style="margin: 0;">Here is your new password, please log in using this password. If you didn't request this, you can safely delete this email.</p>
                            </td>
                          </tr>
                          <!-- end copy -->
                
                          <!-- start button -->
                          <tr>
                            <td align="left" bgcolor="#ffffff">
                              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                    <table border="0" cellpadding="0" cellspacing="0">
                                      <tr>
                                        <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                          <p  target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">${passReset}</p>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <!-- end button -->
                
                          <!-- start copy -->
                          <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                              <p style="margin: 0;">If that doesn't work, please request another reset password</p>
                            </td>
                          </tr>
                          <!-- end copy -->
                
                          <!-- start copy -->
                          <tr>
                            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                              <p style="margin: 0;">Best Regards,<br> Admin Diet On</p>
                            </td>
                          </tr>
                          <!-- end copy -->
                
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                      </td>
                    </tr>
                    <!-- end copy block -->
                
                    <!-- start footer -->
                    <tr>
                      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                        <!--[if (gte mso 9)|(IE)]>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                        <td align="center" valign="top" width="600">
                        <![endif]-->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                
                          <!-- start permission -->
                          <tr>
                            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                              <p style="margin: 0;">You received this email because we received a request reset password for your account. If you didn't request reset password you can safely delete this email.</p>
                            </td>
                          </tr>
                          <!-- end permission -->
                
                          <!-- start unsubscribe -->
                          <!-- end unsubscribe -->
                
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                      </td>
                    </tr>
                    <!-- end footer -->
                
                  </table>
                  <!-- end body -->
                
                </body>
                </html>`
            };

            let Email = ""

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    Email = "Email Sent"
                }
            });

            return res.status(200).json({
                status: "success",
                message: "successfully reset password, and please check email for your new password"
            });
        } catch (error) {
            console.log("🚀 ~ file: usersControllers.js ~ line 499 ~ forgotPass:async ~ error", error)
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error",
            });
        }
  },

  googleSignInWebVersion: async (req, res) => {
    let payload;
    try {
      const userGooglePass = `${req.users._json.azp}${req.users._json.email}${req.users._json.iat}`
      const userCheck = await users.findOne({
        where: {
          email: req.users._json.email
        }
      })

      if (userCheck) {
        payload = {
          role: userCheck.dataValues.role,
          email: userCheck.dataValues.email,
          id: userCheck.dataValues.id
        }
      } else {
        const createProfile = await users.create({
          fullName: req.users._json.name,
          email: req.users._json.email,
          profilePic: req.users._json.picture,
          password: encrypt(userGooglePass),
          height: 0,
          earlyWeight: 0,
          calorieSize: 0,
          progress: 0,
          BMI: 0,
          isVerified: true
        })

        const createCalorie = await calorieTrackers.create({
          userId: createProfile.dataValues.id,
          calConsumed: 0,
          remainCalSize: 0,
          data: moment(new Date()).local().format("YYYY-M-D")
        })

        const createWeight = await weightMeasures.create({
          userId: createProfile.dataValues.id,
          weight: 0,
          waistline: 0,
          thigh: 0,
          date: moment(new Date()).local().format("YYYY-M-D")
        });
        payload = {
          role: createProfile.dataValues.role,
          email: createProfile.dataValues.email,
          id: createProfile.dataValues.id
        }
      };

      const token = generateToken(payload)

      return res.status(200).json({
        status: "success",
        message: "sign in successfully",
        token: token,
      });

    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: "Internal Server Error",
      });
    }
  },

  googleSignInMobVersion: async (req, res) => {
    const { token } = req.body;
    const googleAuth = await verify(token);
    const userGooglePass = `${googleAuth.azp}${googleAuth.email}${googleAuth.iat}`
    let payload;

    try {
      const userCheck = await users.findOne({
        where: {
          email: googleAuth.email
        }
      })

      if (userCheck) {
        payload = {
          role: userCheck.dataValues.role,
          email: userCheck.dataValues.email,
          id: userCheck.dataValues.id
        }
      } else {
        const createProfile = await users.create({
          fullName: googleAuth.name,
          email: googleAuth.email,
          profilePic: googleAuth.picture,
          password: encrypt(userGooglePass),
          height: 0,
          earlyWeight: 0,
          calorieSize: 0,
          progress: 0,
          BMI: 0,
          isVerified: true
        })

        const createCalorie = await calorieTrackers.create({
          userId: createProfile.dataValues.id,
          calConsumed: 0,
          remainCalSize: 0,
          data: moment(new Date()).local().format("YYYY-M-D")
        })

        const createWeight = await weightMeasures.create({
          userId: createProfile.dataValues.id,
          weight: 0,
          waistline: 0,
          thigh: 0,
          date: moment(new Date()).local().format("YYYY-M-D")
        });
        payload = {
          role: createProfile.dataValues.role,
          email: createProfile.dataValues.email,
          id: createProfile.dataValues.id
        }
      };

      const token = generateToken(payload)

      return res.status(200).json({
        status: "success",
        message: "sign in successfully",
        token: token
      });

    } catch (error) {
      return res.status(500).json({
        status: "failed",
        message: "Internal Server Error",
      });
    }
  }
};
