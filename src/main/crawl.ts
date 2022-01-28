/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import axios from 'axios';
import cheerio from 'cheerio';
import { IMangaSearchList, IMangaInfo } from '../interfaces';

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

const getInfo = async (mangaLink: string) => {
  const resp = await axios.get(mangaLink);
  const $ = cheerio.load(resp.data);
  const mangaInfo = <IMangaInfo>{};
  mangaInfo.name = $('.series-name a').text();
  const tagRaw = $('.badge-info');
  mangaInfo.tag = Array.from(tagRaw.map((_index, el) => $(el).text()));
  const tempArray = $('div.series-information > .info-item').toArray();
  tempArray.forEach((el) => {
    switch ($(el).find('.info-name').text()) {
      case 'Tình trạng:':
        mangaInfo.status = $(el).find('.info-value').text();
        break;
      case 'Tác giả:':
        mangaInfo.author = $(el).find('.info-value').text();
        break;
      case 'Tên khác:':
        mangaInfo.otherName = $(el).find('.info-value').text();
        break;
      default:
        break;
    }
  });
  const style = $('.series-cover > div > div').attr('style') || '';
  const imgurl = style.match(/url\(["']?([^"']*)["']?\)/);
  // eslint-disable-next-line prettier/prettier
  imgurl ? (mangaInfo.thumbnail = imgurl[1]) : null;
  mangaInfo.summary = $('div.summary-content > p').text() || '';
  const chapters = $('.list-chapters.at-series > a')
    .toArray()
    .map((link) => {
      return {
        chapter: $(link).attr('title') || '',
        url: $(link).attr('href') || '',
      };
    });
  mangaInfo.chapters = chapters;
  return mangaInfo;
};

export { search, getInfo };
