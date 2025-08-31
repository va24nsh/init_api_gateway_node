import express from "express";
import routes from "./routes";
import rateLimiter from "./middlewares/rateLimiter";
import { verifyToken } from "./middlewares/authenticate";
import errorHandler from "./middlewares/errorHandler";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);

routes.forEach(route => {
    const middlewares = [];

    if(route.authRequired) {
        middlewares.push(verifyToken);
    }

    middlewares.push(createProxyMiddleware({
        target: route.target,
        changeOrigin: true,
        pathRewrite: {
            [`^${route.path}`]: '',
        },
    }));

    app.use(route.path, ...middlewares);
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});