var keystone = require('keystone');
var	Types = keystone.Field.Types;

/**
 * Product Model
 * ==================
 */

var Product = new keystone.List('Product', {
	map: { name: 'title' },
	singular: 'product',
	plural: 'products',
	autokey: { path: 'slug', from: 'title', unique: true },
});

Product.add({
	title: { type: String, require: true, note: 'Titulo / Modelo' },
	price: { type: String },
	categories: { type: Types.Relationship, ref: 'ProductCategory', many: true },
	description: { type: Types.Html, wysiwyg: true, height: 300 },
	productImage: { type: Types.CloudinaryImage, width: 600, height: 435 },
	images: { type: Types.CloudinaryImages },
	publishDate: { type: Date, default: Date.now() },

});

Product.register();
