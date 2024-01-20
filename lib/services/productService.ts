// cache: To cache the DB query result & prevent multiple hitting DB
import { cache } from "react";
import dbConnect from "../dbConnect";
import ProductModel, { Product } from "../models/ProductModel";
// The cache value will be updated at most every hour
export const revalidate = 3600;
//returned value will be cached
const getLatest = cache(async () => {
  await dbConnect();
  const products = await ProductModel.find({})
    .sort({ _id: -1 }) //descending order => most recent products
    .limit(4)
    .lean(); //Retrieves the data as plain JavaScript objects instead of full Mongoose documents, potentially improving performance
  return products as Product[];
});

const getFeatured = cache(async () => {
  await dbConnect();
  const products = await ProductModel.find({ isFeatured: true })
    .limit(3)
    .lean(); //Retrieves the data as plain JavaScript objects instead of full Mongoose documents, potentially improving performance
  return products as Product[];
});

const getBySlug = cache(async (slug: string) => {
  await dbConnect();
  const product = await ProductModel.findOne({ slug }).lean();
  return product as Product;
});

const productService = { getLatest, getFeatured, getBySlug };
export default productService;
