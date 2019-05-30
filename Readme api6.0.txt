URL guide:
https://www.youtube.com/playlist?list=PLzQWIQOqeUSMzMUEJA0XrOxJbX8WTiCJV

npm init --yes - створення файлу packege.json
npm install express - модуль для роботи з фреймворком express
npm install cross-env - модуль для роботи скрипта нижче
"dev": "cross-env NODE_ENV=development node src/index.js" - прописано в scripts в файлі package.json. Це сценарій запуску команди npm run(запускати index.js в папці src, яка знаходиться в кореневій папці проекту)
npm run - +
npm install -D babel-preset-env babel-plugin-transform-object-rest-spread - опис нижче
npm install -D webpack babel-core babel-loader webpack-node-externals - ці плюс модулі з попередньої разом з файлами в корені проекту .babelrc та webpack.config.js дають можливість використовувати import
"dev": "cross-env NODE_ENV=development node dist/index.bundle.js" - змінений скрипт
"dev:build": "webpack -w" - прописано в scripts в файлі package.json, сценарій запуску команди npm run
npm install -D webpack-cli - доставив додатково для роботи скрипта вище
npm install -D nodemon - модуль перевіряє зміни в компільованому файлі через webpack
"dev": "cross-env NODE_ENV=development nodemon dist/index.bundle.js" - змінений скрипт
npm install mongoose body-parser compression helmet && npm install -D morgan - модулі: 1) для роботи з MongoDB, 2) при відкритті сторінки в браузері повідомляє про це в термінал
npm install validator - модуль для перевірки(наприклад чи правильний імейл)
npm install joi - модуль потрібен при валідації(захисту даних чи тіпа того)
npm install express-validation - модуль для валідації, щоб прописати в middleware
npm install -D rimraf - модуль для видалення папок
"clean": "rimraf dist" - прописано в scripts в файлі для видалення папки dist
"dev:build": "npm run clean && webpack -w" - змінений скрипт
npm install bcrypt-nodejs - модуль для шифрування паролів
npm install passport passport-local - модуль для авторизації користувачів
npm install jsonwebtoken passport-jwt - модуль для авторизації користувачів
npm install slug - модуль який в текстовій змінній пробіли заміняє дефісом, а всі букви робить маленькими
npm install mongoose-unique-validator - модуль для вирішення проблеми унікальності полів в базі MongoDB(щоб можна було виводити повідомлення, якщо така змінна уже введена в базу)
npm install http-status - модуль для заміни цифрових позначень статусу вебсторінки текстовими
npm install -D prettier - модуль для автоматичного форматування коду(для кращого вигляду)
"prettier": "prettier --single-quote --print-width 80 --trailing-comma all --write 'src/**/*.js'" - прописано в scripts в файлі package.json. Застосовує модуль добавлений вище із зазначеними параметрами
