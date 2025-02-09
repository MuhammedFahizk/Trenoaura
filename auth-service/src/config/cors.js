const allowlist = [process.env.CLIENT_URL];
export const corsOptions = {
  origin: function (origin, callback) {
    if (allowlist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  exposedHeaders: ["WWW-Authenticate"],
};

