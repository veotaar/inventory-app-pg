const db = require('../db/queries');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
  const { gameCount, devCount, genreCount } = await db.getCounts();

  return res.render('index', {
    title: 'Home Page',
    gameCount,
    devCount,
    genreCount
  });
});
