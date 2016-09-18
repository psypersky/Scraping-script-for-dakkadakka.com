const axios = require('axios');
const cheerio = require('cheerio');

// Scrapping minis
axios.get('http://www.dakkadakka.com/gallery/821501-Deathwatch%20-%20Antor%20Delassio.html')
.then(({ data }) => {
  const $ = cheerio.load(data);

  //const urlPath = url.parse(page.location.href).path;

  let table = $('#gallery');

  // Title
  let h3 = table.find('h3'); // title

  // Top container
  let topTable = h3.parent().parent().parent();

  // Author
  let authorContainer = topTable.children().eq(0).children().eq(1).find('a');
  let author = '';
  let authorUrl = '';
  if (authorContainer.length) {
    author = authorContainer.text();
    authorUrl = authorContainer.prop('href');
  }

  // Rating, Views
  let ratingViewsContainer = topTable.children().eq(1).children().eq(0).find('b');
  let paintjobRating = '';
  let views = '';
  if (ratingViewsContainer.length) {
    paintjobRating = ratingViewsContainer.text();
    views = ratingViewsContainer.text();
  }

  // Coolness, Votes
  let coolnessVotesContainer = topTable.children().eq(2).children().eq(0).find('b');
  let coolnessRating = '';
  let votes = '';
  if (coolnessVotesContainer.length) {
    coolnessRating = coolnessVotesContainer.text();
    votes = coolnessVotesContainer.text();
  }

  // Tags
  let tags = [];
  table.children().eq(4).find('.forumline').children().eq(0).children().eq(0).children().each(function(index, element) {
    tags.push({
      name: $(this).text(),
      href: $(this).prop('href'),
    })
  });

  let imageDetailsContainer = $('form[name=formx]').parent().parent().parent().parent().children().eq(2).find('table');
  let resolution = imageDetailsContainer.children().eq(1).children().eq(1).text();
  let uploaded = imageDetailsContainer.children().eq(2).children().eq(1).text();

  let galleryNameContainer = table.children().eq(3).find('.gensmall').eq(0).find('a');
  let galleryUrl = '';
  let galleryName = '';
  if (galleryNameContainer.length) {
    galleryUrl = galleryNameContainer.prop('href');
    galleryName = galleryNameContainer.text();
  }

  let mini = {
    //key: urlPath,
    title: h3.text().trim(),
    author,
    authorUrl,
    paintjobRating,
    views,
    coolnessRating,
    votes,
    resolution,
    uploaded,
    galleryUrl,
    galleryName,
    tags,
  };

  console.log(mini);
})
.catch((e) => {
  console.error('error', e);
})