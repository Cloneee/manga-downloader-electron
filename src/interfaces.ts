interface IMangaSearchList {
  name: string;
  link: string;
  bgurl: string;
}
interface IMangaInfo {
  mangaInfo: any;
  name: string;
  tag: string[];
  author: string;
  otherName: string;
  status: string;
  thumbnail: string;
  summary: string;
  chapters: {
    chapter: string;
    url: string;
  }[];
}
interface IFolderPath {
  canceled: boolean;
  filePaths: [string];
}

export { IMangaSearchList, IMangaInfo, IFolderPath };
