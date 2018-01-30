const express = require('express');
const path = require('path');

const app = express();

// const port = 3000;
const port = process.env.PORT || 8080


// app.set('views', path.join(__dirname, 'app'));
// app.set('view engine', 'pug');

// app.get('/', (req, res) => {
// res.render('index');
// });

app.use(express.static(__dirname + '/app'));

app.get('/', () => {
	res.sendFile('index.html');
});

app.listen(port, () => {
	console.log('Server starts on port ' + port);
});