/* borrar luego, este archivo es temporal */

import bcrypt from 'bcryptjs';
const password = 'admin123';

bcrypt.hash(password, 10).then(hash => {
    console.log('Hash: ', hash);
    process.exit();
})

// hashed: $2b$10$BjGI7ibpV7KwR0ZjiXYgjupwB6Yrgzn2ipJJ8TSV9YaDAmVOUxShy