import fs from 'fs';
import path from 'path';
import Store from 'electron-store';
import { IMangaLocal } from '../../interfaces';

const store = new Store();

const mangaList = async (dir: string) => {
  try {
    const list = fs.readdirSync(dir);
    const result = [] as IMangaLocal[];
    list.forEach((el) => {
      const uncheckPath = path.join(dir, el);
      if (fs.lstatSync(uncheckPath).isDirectory()) {
        const chapters = fs.readdirSync(uncheckPath);
        result.push({ name: el, chapters });
      }
    });
    store.set('localList', result);
    return result;
  } catch (error) {
    return [] as IMangaLocal[];
  }
};

const loadList = () => {
  return store.get('localList') as IMangaLocal[];
};

const loadImages = async (dir: string, name: string, chapter: string) => {
  const imagesPath = path.join(dir, name, chapter);
  const result = fs.readdirSync(imagesPath);
  return result;
};

export { mangaList, loadList, loadImages };
