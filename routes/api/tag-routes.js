const router = require('express').Router();
const {Tag, Product, ProductTag} = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data

  try {
    const foundTags = await Tag.findAll({
      include: [{
        model: Product,
      }]
    });

    res.json(foundTags);
  }
  catch (err) {
    res.json(err.message);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const foundTag = await Tag.findByPk(req.params.id, {
      include: [{
        model: Product,
      }]
    });
    if (!foundTag) {
      res.status(404).json({message: 'No tag found!'});
      return;
    }
    res.status(200);
    res.json(foundTag);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const [newTag, created] = await Tag.findOrCreate({
      where: {
        tag_name: req.body.tag_name
      }

    });
    if (created) {
      res.status(200).json(`TAG ${newTag.tag_name} has been successfully created`);
    }
    else {
      res.status(400).json(`TAG ${newTag.tag_name} already exists`);
    }

  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagUpdateData = await Tag.update({tag_name: req.body.tag_name}, {
      where: {
        id: req.params.id,
      }
    });

    tagUpdateData[0] === 1 ? res.status(200).json(`SUCCESSFULLY UPDATED TAG ${req.body.tag_name}`) : res.status(400).json('ERROR: No tag with that ID found');

  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const foundTag = await Tag.findByPk(req.params.id);
    if (!foundTag) {
      res.status(400).json('NO category with that ID found')
    }
    else {
      //check if it's a category object
      if (foundTag instanceof Tag) {
        const didDestroy = await foundTag.destroy();

        res.status(200).json(`SUCCESSFULLY DELETED TAG ${didDestroy.tag_name}`);


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
