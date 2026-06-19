module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'https://ianbakeland.github.io',
        'http://localhost:5174',
        'https://localhost:5174',
        'http://localhost:5173',
        'https://192.168.0.133:5173',
        'https://192.168.0.119:5173',
        'https://localhost:5173'
      ],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];