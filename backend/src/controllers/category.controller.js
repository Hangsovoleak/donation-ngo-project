import { listCategories } from "../services/category.service.js";

// GET /api/categories
export async function listCategoriesController(req, res, next) {
  try {
    //create categories using await to pause the execution of an async function util a Promise is fulfilled as listCategories.
    const categories = await listCategories();
    //return categories
    res.json(categories);
  } catch (err) {
    next(err);
  }
}
