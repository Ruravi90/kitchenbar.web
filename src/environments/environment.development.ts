export const environment = {
    version: require('../../package.json').version + '-dev',
    production: false,
    baseUrl: 'http://localhost:4200/client/',
    apiBase: 'https://localhost:5001/api/',
    hubBase: 'https://localhost:5001/hubs/base',
    publicKey:'BGCRL5HzYcj1d9_XThOzy78j278TqvKRO_Qa08vR7BEDkTQt9x2yxXYQdKJbjRNyFV53JNq7pMx6naT8RwPbum4',
    stripePublicKey: 'pk_test_51SZgdgQdjXuRlZRWKzKOLXZzs2TgSfGgqu9YhJXozQLTrB9PJG9HysRE1UCC5Xpli4YiNGAo7ab6KtEhBGWak2YM00vTtAlMph',
    vapidPublicKey: 'BJwPZOYDBkdfrs3WDzcjmvqsBw8hsm0NFH3g0kEp8mE075bWXZgPpYoh58-lBzbGrlaA24PS8RZSIO5tpyphroE'
};
