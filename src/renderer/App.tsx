/* eslint-disable no-console */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { IMangaSearchList, IFolderPath, IMangaInfo } from '../interfaces';
import icon from '../../assets/icon.svg';
import { ResultCard } from './components/common/ResultCard';

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
      };
    };
  }
}

const Hello = () => {
  const [search, setSearch] = useState('');
  const [results, setresults] = useState<IMangaSearchList[]>([]);
  const handleGetDownloadPath = async () => {
    const result = await window.electron.openDialog.open();
    window.electron.store.set('savePath', result.filePaths[0]);
    // eslint-disable-next-line no-console
    console.log(window.electron.store.get('savePath'));
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    handleSearch()
  };
  const handleSearch = async () => {
    const result = await window.electron.crawler.search(search);
    console.log(result);
    setresults(result)
  };
  return (
    <div className="row text-center gap-3">
      <div className="Hello">
        <img width="20px" alt="icon" src={icon} />
      </div>
      <h1>Fayaku Manga Downloader</h1>
      <div className='col-12 d-flex justify-content-center '>
        <input style={{width: '300px', marginRight: '10px', paddingLeft:'15px', paddingRight:'15px'}} type="text" id="search-bar" onChange={handleSearchChange} />
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleSearch}
          style={{ marginRight: '10px'}}
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
      <div className='col-12 d-flex justify-content-center '><strong>{results.length} &#160;</strong> Results</div>
      <div className=' row  d-flex justify-content-center' >
      {
        results.map((item: IMangaSearchList, index) =>{
          return (
            <div className='col-lg-2 col-md-3 col-sm-6' >
               <ResultCard item={item} />
            </div>
           
          )
        })
      }
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
