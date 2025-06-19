import { Request, Response, NextFunction } from 'express';
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() });

export const file = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers['content-type']?.startsWith('multipart/form-data')) {
    return next()
  }

  upload.any()(req, res, (err) => {
    if (err) return next(err);
    // If 'data' field exists and is a JSON string, parse it into req.body
    if (req.body && typeof req.body.data === 'string') {
      try {
        console.log(req.body.data)
        const parsed = JSON.parse(req.body.data as string);
        req.body = parsed;
      } catch (parseErr) {
        return res.status(400).json({ error: 'Invalid JSON in "data" field' });
      }
    }

    console.log('req.files', req.files);

    if (Array.isArray(req.files)) {
    const obj: { [key: string]: Express.Multer.File[] } = {}
    req.files?.forEach((file: Express.Multer.File) => {
      if (!obj[file.fieldname]) {
        obj[file.fieldname] = []
      }
      obj[file.fieldname].push(file)
    })

    req.files = obj
    }

    next();
  });
}