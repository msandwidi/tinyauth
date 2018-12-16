const express = require('express');
const chalk = require('chalk');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const config = require('./config'); // configuration keys

const isProdMode = process.env.NODE_ENV === 'production';

const app = express();

const whitelist = [ config.CLIENT_BASE_URL, config.API_BASE_URL ];
const corsOptions = {
	origin: function(origin, callback) {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			return callback(null, true);
		} else {
			return callback(new Error('Not allowed by CORS'), false);
		}
	}
};

app.use(cors(corsOptions)); // unable cors

if (isProdMode) {
	app.disable('x-powered-by'); // dieable x-powered-by express
	app.use(morgan('common'));
} else {
	app.use(morgan('dev'));
}

app.set('trust proxy', 1);

mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
mongoose
	.connect(config.MONGO_URI, {
		useNewUrlParser: true
	})
	.then(() => {
		console.log(chalk.green('✓-- ') + 'MongoDB ' + chalk.green('Connected'));
	})
	.catch((err) => {
		console.log(chalk.red('✗-- ') + 'Database Connection Error: ' + err.toString());
		process.exit(1);
	});

app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(bodyParser.json());

require('./controlers/home')(app);
require('./controlers/user')(app);
require('./controlers/admin')(app);

if (isProdMode) {
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

app.listen(config.PORT, () => console.log(chalk.green('✓-- ') + `App is running at port: ${config.PORT}`));

module.exports = app;
