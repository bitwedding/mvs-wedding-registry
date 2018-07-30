module.exports = {
    secret: (process.env.CAPTCHA_SECRET) ? process.env.CAPTCHA_SECRET : "SUPER_SECRET",
    length: (process.env.CAPTCHA_LENGTH) ? parseInt(process.env.CAPTCHA_LENGTH) : 6,
    blacklist: (process.env.CAPTCHA_BLACKLIST) ? process.env.CAPTCHA_BLACKLIST : "0o1i",
    color: (process.env.CAPTCHA_COLOR) ? process.env.CAPTCHA_COLOR == "true" : true,
    backgroud: (process.env.CAPTCHA_BACKGROUND) ? process.env.CAPTCHA_BACKGROUND : "#ffffff",
    noise: (process.env.CAPTCHA_NOISE) ? parseInt(process.env.CAPTCHA_NOISE) : 1,
    expire: (process.env.CAPTCHA_EXPIRE) ? parseInt(process.env.CAPTCHA_EXPIRE) : 60
};
