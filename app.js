require('dotenv').config();
require('express-async-errors');

// express setup
const express = require('express');
const app = express();

// auxillary packages
const morgan = require('morgan');

// database connection
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoutes');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Books Api');
});

app.use('/api/v1/auth', authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		app.listen(port, console.log(`Server is listening on port ${port}...`));
	} catch (error) {
		console.log(error);
	}
};

start();
