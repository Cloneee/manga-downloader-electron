/* eslint-disable react/no-array-index-key */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useRef, useState , useEffect } from 'react';
import { IMangaSearchList, IFolderPath, IMangaInfo, IMangaDownload } from '../interfaces';
import icon from '../../assets/icon.svg';
import { ResultCard } from './components/common/ResultCard';
import { Info } from './components/screens/Info';
import { ChapterInfo } from './components/screens/ChapterInfo';

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
        getInfo: (mangaLink: string) => Promise<IMangaInfo>;
        getImages: (mangaChapter: IMangaDownload) => Promise<string[]>;
        download: (mangaChaper: IMangaDownload) => Promise<void>;
      };
    };
  }
}

const Hello = () => {
  const [search, setSearch] = useState('');
  const [results, setresults] = useState<IMangaSearchList[]>([]);
  const [path, setpath] = useState('');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(()=>{
    if (window.electron.store.get('savePath')) {
      setpath(window.electron.store.get('savePath'));
    }
  }, [])

  const handleGetDownloadPath = async () => {
    const result = await window.electron.openDialog.open();
    if (!result.canceled) {
      window.electron.store.set('savePath', result.filePaths[0]);
      setpath(window.electron.store.get('savePath'));
    }
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

    // clear debounce
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (e.target.value) {
      typingTimeoutRef.current = setTimeout(() => {
        handleSearch();
      }, 300);
    } else return;
  };
  const handleSearch = async () => {
    const result = await window.electron.crawler.search(search);
    // console.log(result);
    setresults(result);
  };
  return (
    <div className="row text-center gap-3">
      <div className="Hello">
        <img width="20px" alt="icon" src={icon} />
      </div>
      <h1>Fayaku Manga <span className="badge bg-danger">Downloader</span> </h1>
      <div className="col-12 d-flex justify-content-center ">
        <input
          style={{
            width: '300px',
            marginRight: '10px',
            paddingLeft: '15px',
            paddingRight: '15px',
          }}
          type="text"
          id="search-bar"
          onChange={handleSearchChange}
        />
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleSearch}
          style={{ marginRight: '10px' }}
        >
          <i className="fas fa-search"></i>
        </button>
        <button
          type="button"
          className="btn btn-info "
          onClick={handleGetDownloadPath}
        >
          <i className="fas fa-folder"></i>
        </button>
      </div>
      <div className="col-12 d-flex justify-content-center ">
        <strong>{results.length} &#160;</strong> Kết quả | Đường dẫn:  &#160;<strong >{path !== '' ? `...${ path.substring(path.length-15,path.length)}`: 'Chưa chọn'}</strong>
      </div>
      <div className=" row  d-flex justify-content-center">
        {results.map((item: IMangaSearchList, index) => {
          return (
            <div key = {index} className="col-lg-2 col-md-3 col-sm-6">
              <ResultCard item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
        <Route path="/info" element={<Info />} />
        <Route path="/chapter" element={<ChapterInfo />} />
      </Routes>
    </Router>
  );
}
