import { Request, Response, NextFunction } from "express"
import _ from "lodash";

const validator =
  (schema: { validateAsync: (arg0: any) => any; }, source = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const _source = source === 'body' ? req.body : req.query
      let value = await schema.validateAsync(_source);
      if (source === "body") {
        req._body = req?.body; // for debugging purposes
        req.body = value; // validated value
      }
      if (source === "query") {
        req._query = req?.query; // for debugging purposes
        req.query = value; // validated value
      }
      return next();
    } catch (err: any) {
        return res.status(500).json({
          message: err.message,
          success: false,
        });
    }
  };

export default validator;
