/* eslint-disable no-console */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { IMangaSearchList, IFolderPath } from '../interfaces';
import icon from '../../assets/icon.svg';
import './App.css';

declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        // any other methods you've defined...
      };
      openDialog: {
        open: () => Promise<IFolderPath>;
      };
      crawler: {
        search: (mangaName: string) => Promise<IMangaSearchList[]>;
      };
    };
  }
}

const Hello = () => {
  const [search, setSearch] = useState('');
  const handleGetDownloadPath = async () => {
    const result = await window.electron.openDialog.open();
    window.electron.store.set('savePath', result.filePaths[0]);
    // eslint-disable-next-line no-console
    console.log(window.electron.store.get('savePath'));
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleSearch = async () => {
    const result = await window.electron.crawler.search(search);
    console.log(result);
  };

  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>Fayaku Manga Downloader</h1>
      <div className="Hello">
        <input type="text" id="search-bar" onChange={handleSearchChange} />
        <button type="button" onClick={handleSearch}>
          Search
        </button>
        <button type="button" onClick={handleGetDownloadPath}>
          Get dir
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
