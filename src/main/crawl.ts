/* eslint-disable prettier/prettier */
/* eslint global-require: off, no-console: off, promise/always-return: off */
import path from 'path';
import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import { IMangaSearchList } from '../interfaces';

const search = async (mangaName: string) => {
  let mangaList: IMangaSearchList[];
  // eslint-disable-next-line prefer-const
  mangaList = [];
  const resp = await axios.get(
    `https://truyentranhlh.net/tim-kiem?q=${mangaName}`
  );
  const $ = cheerio.load(resp.data);
  $('.thumb-item-flow').each((_index, el) => {
    // get link + name
    const aTag = $(el).find('.thumb_attr.series-title').find('a');
    const name = aTag.text();
    const link = aTag.attr('href');

    // get thumbnail
    const bg = $(el)
      ?.find('div.thumb-wrapper > a > div > div')
      ?.css('background-image')
      ?.trim();
    const convertBg = bg as string;
    const bgurl = convertBg.substring(5, convertBg.length - 2);
    const newlink = link as string;
    mangaList.push({
      name,
      link: newlink,
      bgurl,
    });
  });
  return mangaList;
};

const crawl = (link: string) => {
  return link;
};

export { search, crawl };
