var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'produtos';
	locals.data = {
		products: [],
		categories: [],
	};

	// Load all categories
	view.on('init', function (next) {

		keystone.list('ProductCategory').model.find().sort('name').exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.categories = results;

			// Load the counts for each category
			async.each(locals.data.categories, function (category, next) {

				keystone.list('Product').model.count().where('categories').in([category.id]).exec(function (err, count) {
					category.productCount = count;
					next(err);
				});

			}, function (err) {
				next(err);
			});
		});
	});

	// Load the current category filter
	// view.on('init', function (next) {

	// 	if (req.params.category) {
	// 		keystone.list('ProductCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
	// 			locals.data.category = result;
	// 			next(err);
	// 		});
	// 	} else {
	// 		next();
	// 	}
	// });

	// Load the products
	view.on('init', function (next) {

		var q = keystone.list('Product')
			.paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10,
			})
			.populate('categories');
		;

		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);
		}

		q.exec(function (err, results) {
			// results { total: , results: {} };
			locals.data.products = results;

			locals.data.dados = JSON.stringify(results.results); 
			// console.log(locals.data.products);
			next(err);
		});
	});

	// Render the view
	view.render('products');
};
