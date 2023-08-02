import { CorsOptions } from "cors"
import { SessionOptions } from "express-session"

const morganConfig = `:date[iso] :method :url :status :response-time ms :remote-addr :http-version :referrer :user-agent`

const corsConfig: CorsOptions = {
  origin: '*',
  // methods: ["GET", "POST", "PATCH", "DELETE"],
  // allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With", "Origin"],
  exposedHeaders: ['Authorization'],
  // credentials: true,
}

const sessionConfig: SessionOptions = {
  name: "connect.sid",
  secret: process.env.SESSION_SECRET_KEY as string,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 86400000,
  },
}

export { morganConfig, corsConfig, sessionConfig }