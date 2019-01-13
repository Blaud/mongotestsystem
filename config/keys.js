module.exports = {
    // mongoURI: process.env.MONGODB_URI || "mongodb://test:qqwwqq12@ds063929.mlab.com:63929/dev",
    mongoURI: process.env.MONGODB_URI || "mongodb://127.0.0.1/mydb",
    jwt: process.env.JWT || "dev jwt",
    loaderio: process.env.LOADERIO_VERIFICATION_KEY || 'test'
};