var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
	const rootPath = req.app.get('PATH');

	if (!rootPath) {
		res.render('index', {
			title: 'Files explorer',
			err: 'No path was selected',
		});

		return;
	}

	scanDirectory(rootPath)
		.then(result => {
			res.render('index', {
				title: 'Files explorer',
				currentPath: rootPath,
				data: result,
			});
		})
		.catch(err => {
			res.render('index', {
				title: 'Files explorer',
				err: err,
			});
		});
});

const scanDirectory = (rootPath, queryPath) => {
	return new Promise(resolve => {
		const data = [];
		let searchPath = '';

		if (!queryPath) {
			searchPath = rootPath;
		} else {
			searchPath = path.join(rootPath, queryPath);
		}

		const isDirectory = fs.statSync(searchPath).isDirectory();

		if (isDirectory) {
			fs.readdir(searchPath, (err, items) => {
				items.forEach(item => {
					// Check for .hiddenFile
					if (item[0] !== '.') {
						const subItem = {};
						subItem.name = item;
						subItem.isDirectory = fs.statSync(path.join(searchPath, item)).isDirectory();

						if (!subItem.isDirectory) {
							subItem.extension = path.extname(subItem.name);
						}

						if (queryPath) {
							subItem.path = encodeURI(path.join(queryPath, item));
						} else {
							subItem.path = encodeURI(item);
						}

						data.push(subItem);
					}
				});
				resolve(data);
			});
		}
	});
};

router.get('/folder', function(req, res, next) {
	const rootPath = req.app.get('PATH');
	const queryPath = req.query.path || '';
	const pathArr = queryPath.split('/');
	pathArr.pop();

	const previousDir = {};

	let prevPath = encodeURI(pathArr.join('/'));

	if (prevPath === '') {
		prevPath = null;
	}

	scanDirectory(rootPath, queryPath)
		.then(result => {
			res.render('index', {
				title: 'Files explorer',
				currentPath: path.join(rootPath, queryPath),
				prevPath,
				data: result,
			});
		})
		.catch(err => {
			res.render('index', {
				title: 'Files explorer',
				err: err,
			});
		});
});

module.exports = router;
