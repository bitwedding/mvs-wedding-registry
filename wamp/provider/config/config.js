module.exports = {
    task: (process.env.PROVIDE_TASK) ? process.env.PROVIDE_TASK : 'NONE',
    timer: {
        listings: (process.env.LISTINGS_TIMER) ? process.env.LISTINGS_TIMER : 1000
    }
};
