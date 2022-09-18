import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Container,
  Pagination,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { IMangaSearchList } from '../../../interfaces';
import { Menu } from '../common/Menu';
import { ResultCard } from '../common/ResultCard';

const style = {
  mangaContainer: {
    p: 2,
    mt: 2,
    backgroundImage:
      'linear-gradient(to right top, #0f1325, #111528, #13182a, #151a2d, #171c30, #191e32, #1a1f35, #1c2137, #1e233a, #1f243c, #21263f, #232842)',
  },
};

export const Index = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<IMangaSearchList[]>([]);
  const [path, setpath] = useState('');
  const [page, setPage] = useState(1);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (window.electron.store.get('savePath')) {
      setpath(window.electron.store.get('savePath'));
    }
    window.electron.crawler
      .search('', 1)
      .then((result) => setResults(result))
      .catch((e) => console.log(e));
  }, []);
  const handleGetDownloadPath = async () => {
    const result = await window.electron.openDialog.open();
    if (!result.canceled) {
      window.electron.store.set('savePath', result.filePaths[0]);
      setpath(window.electron.store.get('savePath'));
    }
  };
  const handleSearch = async () => {
    const result = await window.electron.crawler.search(search, page);
    // console.log(result);
    setResults(result);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

    // clear debounce
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (e.target.value) {
      typingTimeoutRef.current = setTimeout(() => {
        setPage(1);
        handleSearch();
      }, 750);
    }
  };

  const handleChangePage = async (
    e: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    const result = await window.electron.crawler.search(search, value);
    setResults(result);
  };

  return (
    <Container sx={{ display: 'flex ', gap: 2, mt: 2 }} maxWidth="xl">
      <Box sx={{ flexGrow: 1, flexShrink: 0 }}>
        <Menu />
      </Box>
      <Box sx={{ flexGrow: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <TextField
            size="small"
            label="Tìm kiếm"
            onChange={handleSearchChange}
          />
          <IconButton aria-label="search">
            <SearchIcon />
          </IconButton>
        </Box>
        <Box sx={style.mangaContainer}>
          <Typography>Truyện mới cập nhập</Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              mt: 2,
              gap: 2,
              justifyContent: 'space-between',
              alignItem: 'stretch',
              alignContent: 'flex-start',
            }}
          >
            {results.map((item) => (
              <ResultCard item={item} key={item.name} />
            ))}
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={400}
              showFirstButton
              showLastButton
              page={page}
              onChange={handleChangePage}
              size="large"
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Index;
