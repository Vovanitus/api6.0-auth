const devConfig = {
    MONGO_URL: 'mongodb://localhost/api6_0-dev',
    JWT_SECRET: 'thisisasecret',
};
const testConfig = {
    MONGO_URL: 'mongodb://localhost/api6_0-test',
};
const prodConfig = {
    MONGO_URL: 'mongodb://localhost/api6_0-prod',
};
const defaultConfig = {
    PORT: process.env.PORT || 3000,
};

function envConfig(env) {
    switch (env) {
        case 'development':
            return devConfig;
        case 'test':
            return testConfig;
        default:
            return prodConfig;
    }
}

export default {
    ...defaultConfig,
    ...envConfig(process.env.NODE_ENV),
};
