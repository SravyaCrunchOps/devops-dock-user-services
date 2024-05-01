const morgan = require('morgan');
// const logger = require('../logger/expressWinston');

const isSkip = () => {
    const env = process.env.NODE_ENV || "development";
    // console.log(env !== 'development')
    return env !== 'development';
}

// morgan middleware
const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
        stream: {
            write: (msg) => console.info(msg)
        },
        skip: isSkip
    }
)

module.exports = morganMiddleware;