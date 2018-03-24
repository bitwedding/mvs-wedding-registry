exports.app = {
    "pagesize": (process.env.PAGESIZE) ? process.env.PAGESIZE : 10,
    "http": {
        "port": (process.env.PORT) ? process.env.PORT : '80'
    }
};
