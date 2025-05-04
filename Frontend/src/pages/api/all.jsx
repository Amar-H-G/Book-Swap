import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({
  target: 'https://book-swap-backend-946c.onrender.com',
  changeOrigin: true,
});

export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    proxy.web(req, res, {}, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
