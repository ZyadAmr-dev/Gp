import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  scraped_at: {
    type: Date,
    required: true,
  },
  terms: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  image_downloads: {
    type: [String],
    required: true,
  },
  embedding: {
    type: [[Number]],
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
