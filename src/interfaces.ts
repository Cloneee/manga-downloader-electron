interface IMangaSearchList {
  name: string;
  link: string;
  bgurl: string;
}

interface MangaDownload {
  sonething: string;
}

interface IFolderPath {
  canceled: boolean;
  filePaths: [string];
}

export { IMangaSearchList, MangaDownload, IFolderPath };
