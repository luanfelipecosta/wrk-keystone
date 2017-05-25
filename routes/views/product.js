var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'produtos';
	locals.filters = {
		product: req.params.product,
	};
	locals.data = {
		product: {},
	};

	// Load the current product
	view.on('init', function (next) {

		var q = keystone.list('Product').model.findOne({
			slug: locals.filters.product,
		}).populate('categories');

		q.exec(function (err, result) {
			locals.data.product = result;

			console.log('DATA --> ');
			console.log(locals.data.product);
			next(err);
		});

	});

	// Render the view
	view.render('product');
};
