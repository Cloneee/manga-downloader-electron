import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import '../assets/css/styles.css';
import {
  IFolderPath,
  IMangaDownload,
  IMangaInfo,
  IMangaSearchList,
} from '../interfaces';
import { ChapterInfo } from './components/screens/ChapterInfo';
import { Index } from './components/screens/Index';
import { Info } from './components/screens/MangaInfo';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on: (channel: string, func: unknown) => never;
        once: (channel: string, func: unknown) => never;
      };
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        // any other methods you've defined...
      };
      openDialog: {
        open: () => Promise<IFolderPath>;
      };
      crawler: {
        search: (
          mangaName: string,
          page: number
        ) => Promise<IMangaSearchList[]>;
        getInfo: (mangaLink: string) => Promise<IMangaInfo>;
        getImages: (mangaChapter: IMangaDownload) => Promise<string[]>;
        download: (mangaChaper: IMangaDownload) => Promise<void>;
      };
    };
  }
}
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/info" element={<Info />} />
        <Route path="/chapter" element={<ChapterInfo />} />
      </Routes>
    </Router>
  );
}
