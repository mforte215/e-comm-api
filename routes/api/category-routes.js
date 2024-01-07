const router = require('express').Router();
const {where} = require('sequelize');
const {Category, Product} = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const foundProducts = await Category.findAll({
      include: [{
        model: Product,
      }]
    });

    res.json(foundProducts);
  }
  catch (err) {
    res.json(err.message);
  }

});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const articleData = await Category.findByPk(req.params.id, {
      include: [{
        model: Product,
      }]
    });
    if (!articleData) {
      res.status(404).json({message: 'No user found!'});
      return;
    }
    res.status(200);
    res.json(articleData);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const [newCategory, created] = await Category.findOrCreate({
      where: {
        category_name: req.body.category_name
      }

    });
    if (created) {
      res.status(200).json(`CATEGORY ${newCategory.category_name} has been successfully created`);
    }
    else {
      res.status(400).json(`CATEGORY ${newCategory.category_name} already exists`);
    }

  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryUpdateData = await Category.update({category_name: req.body.category_name}, {
      where: {
        id: req.params.id,
      }
    });

    categoryUpdateData[0] === 1 ? res.status(200).json(`SUCCESSFULLY UPDATED CATEGORY ${req.body.category_name}`) : res.status(400).json('ERROR: No category with that ID found');

  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const foundCategory = await Category.findByPk(req.params.id);
    if (!foundCategory) {
      res.status(400).json('NO category with that ID found')
    }
    else {
      //check if it's a category object
      if (foundCategory instanceof Category) {
        const didDestroy = await foundCategory.destroy();

        res.status(200).json(`SUCCESSFULLY DELETED CATEGORY ${didDestroy.category_name}`);


      }
      else {
        res.status(400).json('ERROR: Something went wrong. Try again')
      }
    }

  }
  catch (err) {
    res.status(400).json(err.message);
  }

});

module.exports = router;
