const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { MemoryStore } = require('express-rate-limit');
const requestIp = require('request-ip');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const UtilityService = require('./services/utility.service');
const JwtService = require('./services/jwt.service');
const MongoDriver = require('./core/drivers/mongo');
const genericRouter = require('./routes/genericRouter');

const app = express();
const router = express.Router();

const accountRateLimiter = rateLimit({
  windowMs: 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: new MemoryStore(),
  keyGenerator: (req) => {
    const accountId = req.headers['x-account-id'];
    return accountId || requestIp.getClientIp(req);
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded (5 req/sec).'
    });
  }
});

class Main {
  constructor(app) {
    this.app = app;
    this.router = router;
    this.utility = new UtilityService();
    this.jwtService = new JwtService();
    this.mongo = new MongoDriver();

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.handleErrors();
  }

  initializeMiddlewares() {
    this.app.use(cors({ origin: '*' }));
    this.app.use(helmet());
    this.app.use(requestIp.mw());
    this.app.use(express.json({ limit: '5mb' }));
  }

  initializeRoutes() {
    this.app.use('/', accountRateLimiter);

    this.routerRecursive(genericRouter);
    this.app.use('/api', this.router);

    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    });
  }

  routerRecursive(routeList, basePath = '') {
    for (const item of routeList) {
      const routePath = (basePath + '/' + item.path).replace(/\/+/g, '/');

      if (item.controller && item.action) {
        this.registerRoute(item, routePath);
      }

      if (item.children?.length) {
        this.routerRecursive(item.children, routePath);
      }
    }
  }

  registerRoute(item, routePath) {
    const upload = multer({
      storage: multer.diskStorage({
        destination: (_, __, cb) =>
          cb(null, path.join(__dirname, './assets/uploads')),
        filename: (_, file, cb) => cb(null, file.originalname)
      })
    });

    const controllerHandler = async (req, res) => {
      try {
        const scope = {
          req,
          res,
          db: this.mongo,
          utility: this.utility,
          jwtService: this.jwtService
        };

        const controller = new item.controller(scope);
        await controller[item.action]();
      } catch (err) {
        console.error(err);
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: 'Internal error' });
        }
      }
    };

    const method = item.type?.toLowerCase();
    const middlewares = item.middlewares || [];

    if (method === 'post') {
      this.router.post(routePath, upload.array('files'), ...middlewares, controllerHandler);
    } else {
      this.router[method](routePath, ...middlewares, controllerHandler);
    }
  }

  handleErrors() {
    process.on('uncaughtException', console.error);
    process.on('unhandledRejection', console.error);
  }
}

new Main(app);

module.exports = app;
