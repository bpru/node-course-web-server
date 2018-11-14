const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('getUpperCase', (text) => text.toUpperCase());

// use middleware
app.use((req, res, next) => {
	const now = new Date().toString();
	const log = `${now}: ${req.method} ${req.url}`
	console.log(log);
	fs.appendFile('server.log', log + '\n', err => {
		if (err) {
			console.log('Unable to append to log.server');
		}
	});
	next(); // required for continuing render page
})
app.use((req, res, next) => {
	res.render('maintanence.hbs', {
		pageTitle: 'We will be right back',
		message: 'The site is under maintanence...'
	});
})

// use an built-in express middleware
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	// res.send('<h1>Hello Express!</h1>');
	// res.send({
	// 	name: 'Jay',
	// 	like: [
	// 		'basketball',
	// 		'computer'
	// 	]
	// })
	res.render('home.hbs', {
		pageTitle: 'Home Page',
		message: 'Welcome!'
	})
});

app.get('/about', (req, res) => {
	// res.send('About Page');
	res.render('about.hbs', {
		pageTitle: 'About Page',
	});
});

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Unable to handle request'
	});
});

app.listen(port, () => console.log(`Server is up on port ${port}`));