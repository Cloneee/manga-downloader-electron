/* eslint-disable react/no-array-index-key */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import FolderIcon from '@mui/icons-material/Folder';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Grid, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import '../assets/css/styles.css';
import {
  IFolderPath,
  IMangaDownload,
  IMangaInfo,
  IMangaSearchList,
} from '../interfaces';
import { Menu } from './components/common/Menu';
import { ResultCard } from './components/common/ResultCard';
import { ChapterInfo } from './components/screens/ChapterInfo';
import { Index } from './components/screens/Index';
import { Info } from './components/screens/MangaInfo';

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
  useEffect(() => {
    if (window.electron.store.get('savePath')) {
      setpath(window.electron.store.get('savePath'));
    }
  }, []);

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
    <Grid container direction="row" alignItems="flex-start" pt={1}>
      <Grid xs={2} ml={1} className="bg-component--dark">
        <Menu />
      </Grid>
      <Grid xs={9} ml={1}>
        <Box className="bg-component--dark" p={2}>
          <TextField
            type="text"
            id="search-bar"
            variant="outlined"
            size="small"
            label="Tìm kiếm"
            sx={{ width: '50%' }}
            onChange={handleSearchChange}
          />

          <Button
            sx={{ paddingInline: '2em', marginInline: '1em' }}
            onClick={handleSearch}
            variant="contained"
            className="btn__primary"
          >
            <SearchIcon /> Tìm
          </Button>
          <Button
            className="btn__primary"
            onClick={handleGetDownloadPath}
            variant="contained"
          >
            <FolderIcon /> Đường dẫn
          </Button>
        </Box>

        <Box className="bg-component--dark" pl={1} p={2} mt={1}>
          <Box pb={1}>Kết quả</Box>
          <Grid container spacing={2}>
            {results.map((item: IMangaSearchList, index) => {
              return (
                <Grid
                  item
                  xs={3}
                  rowSpacing={2}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  key={index}
                >
                  <ResultCard item={item} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Grid>
      {/* <div className="col-12 d-flex justify-content-center ">
        <strong>{results.length} &#160;</strong> Kết quả | Đường dẫn: &#160;
        <strong>
          {path !== ''
            ? `...${path.substring(path.length - 15, path.length)}`
            : 'Chưa chọn'}
        </strong>
      </div> */}
    </Grid>
  );
};

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
