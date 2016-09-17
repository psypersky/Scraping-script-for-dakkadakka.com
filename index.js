"use strict";

/**
 *
 * Dakka Dakka scrapping system
 * How it works:
 *   Scrape all the gallery images
 *     For each image in the gallery
 *       Create an Item object containing the url, name, author, ...
 *       Create an scrapping task for the remaining mini information
 *
 *
 * Notes about nest:
 * Items need to have keys
 *
 * scrape($, page)
 *
 * page: {
 *  data: null,
 *  location: null,
 *  isJSON: false,
 *  valid: false,
 *  html: null,
 *  phantomPage: null,
 *  statusCode: null,
 *  res: null,
 *  $: null
 * }
 *
 **/

const Nest = require('node-nest');
const nest = new Nest({
  workers: 200,
  mongo: {
    db: 'nest_dakkadakka',
    host: '127.0.0.1',
    port: '27017',
  }
});
const inspect = require('util').inspect;
const url = require('url');

const siteUrl = 'http://www.dakkadakka.com';
const galleryQueryUrl = '/core/gallery-search.jsp?p=1&ll=3&auction=0&unapproved=0&coolnesslow=0&coolnesshigh=10&paintjoblow=0&paintjobhigh=10&sort1=7&sort2=0&skip=30&en=&st=&utype=&start=';


nest.addRoute({
  key: 'dakka-dakka-gallery-page',

  url: siteUrl + galleryQueryUrl + '<%= query.start %>',

  scraper: function($, page) {
    var data = {
      items: [],
      jobs: [],
    };

    console.log('Scrapping gallery page', page.location.href);

    let table = $('.row1').eq(1).parent().parent();

    // each tr
    table.children().each(function (i, elem) {

      // each td of each tr (each mini)
      $(this).children().each(function (i, elem) {

        let url = $(this).find('table').children().eq(0).find('a').prop('href');
        let mini = {
          key: url,

          url: url,
          imgSrc: $(this).find('table').children().eq(0).find('img').prop('src'),

          //name: $(this).find('table').children().eq(1).find('a').eq(0).text(),
          //author: $(this).find('table').children().eq(1).find('a').eq(1).text(),
          //authorUrl: $(this).find('table').children().eq(1).find('a').eq(1).prop('href'),

          //paintjob: $(this).find('table').children().eq(2).children().eq(0).find('b').html(),
          //coolness: $(this).find('table').children().eq(2).children().eq(1).find('b').html(),

          //views: $(this).find('table').children().eq(2).children().eq(0).find('b').html(),
          //votes: $(this).find('table').children().eq(2).children().eq(1).find('b').html(),
        };

        // Create mini item
        data.items.push(mini);

        //Create scrapping mini url job
        data.jobs.push({
          routeId: 'dakka-dakka-mini-page',
          query: { url },
        });

      });

    });

    return data;
  }
});

//TODO
// add gallery name
// add tags

nest.addRoute({
  key: 'dakka-dakka-mini-page',

  url: siteUrl + '<%= query.url %>',

  scraper: function($, page) { // Use page to get other info!!
    var data = {
      items: [],
      jobs: [],
    };

    console.log('Scrapping mini page', page.location.href);

    const urlPath = url.parse(page.location.href).path;

    let table = $('#gallery');

    let h3 = table.find('h3'); // title

    let topTable = h3.parent().parent().parent();

    let author = topTable.children().eq(0).children().eq(1).find('a').text();
    let authorUrl = topTable.children().eq(0).children().eq(1).find('a').prop('href');

    let paintjobRating = topTable.children().eq(1).children().eq(0).find('b').text();
    let views = topTable.children().eq(1).children().eq(1).find('b').text();

    let coolnessRating = topTable.children().eq(2).children().eq(0).find('b').text();
    let votes = topTable.children().eq(2).children().eq(1).find('b').text();

    let imageDetails = $('form[name=formx]').parent().parent().parent().parent().parent().html();

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
      key: urlPath,
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
    };

    data.items.push(mini);

    return data;
  }
});


//Create gallery jobs from the image 0 to the image 770370
var firstStart = 0;
var lastStart = 770370;
var step = 30;

for (let i = firstStart; i <= lastStart; i += step) {
  nest.queue('dakka-dakka-gallery-page', { query: { start: i } });
}

//nest.queue('dakka-dakka-gallery-page', { query: { start: 0 } });

nest.start().then(() => console.log('Engine started!'));