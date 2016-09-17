const axios = require('axios');
const cheerio = require('cheerio');


axios.get('http://www.dakkadakka.com/gallery/630126-.html')
.then(({ data }) => {
  const $ = cheerio.load(data);

  // let imageDetailsContainer = $('form[name=formx]').parent().parent().parent().parent().children().eq(2).find('table');

  // let resolution = imageDetailsContainer.children().eq(1).children().eq(1).html();

  // let uploaded = imageDetailsContainer.children().eq(2).children().eq(1).html();

  let galleryNameContainer = $('#gallery').children().eq(3).find('.gensmall').eq(0).find('a');
  console.log(galleryNameContainer.length);
  let galleryUrl = galleryNameContainer.prop('href');
  let galleryName = galleryNameContainer.text();

  console.log(galleryUrl, galleryName);
})
.catch((e) => {
  console.error('error', e);
})