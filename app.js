require('dotenv').config();
require('express-async-errors');

//extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')


const express = require('express');
const app = express();
const  connectDB = require('./db/connect')
const authMiddle = require('./middleware/authentication')


//routers
const jobRouter = require('./routes/jobs')
const AuthRouter = require('./routes/auth')
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

// extra packages
app.set('trust proxy',1)
app.use(rateLimiter({
  windowMs:15*60*1000,
  max:100
}))
app.use(helmet())
app.use(cors())
app.use(xss())

app.get('/',(req,res)=>{
  res.send('job api');
})
// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});
app.use('/api/v1/jobs',authMiddle,jobRouter);
app.use('/api/v1/auth',AuthRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('connected to db.')
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
