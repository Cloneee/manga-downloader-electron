import FolderIcon from '@mui/icons-material/Folder';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { IMangaSearchList } from '../../../interfaces';
import { Menu } from '../common/Menu';
import { ResultCard } from '../common/ResultCard';

export const Index = () => {
  const [search, setSearch] = useState('');
  const [results, setresults] = useState<IMangaSearchList[]>([]);
  const [path, setpath] = useState('');
  const [page, setPage] = useState(1);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (window.electron.store.get('savePath')) {
      setpath(window.electron.store.get('savePath'));
    }
    window.electron.crawler
      .search('', 1)
      .then((result) => setresults(result))
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
    setresults(result);
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
        setPage(1);
      }, 300);
    }
  };

  return (
    <Grid container direction="row" alignItems="flex-start" pt={1}>
      <Grid xs={2} ml={1} className="bg-component--dark">
        <Menu />
      </Grid>
      <Grid xs={9} ml={1}>
        <Box className="bg-component--dark" p={2} sx={{ display: 'flex' }}>
          <TextField
            type="text"
            id="search-bar"
            variant="outlined"
            size="small"
            label="Tìm kiếm"
            sx={{ width: '50%', flexShrink: 0 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleSearchChange}
          />
          <Button
            className="btn__primary"
            onClick={handleGetDownloadPath}
            variant="contained"
            sx={{ paddingInline: '2em', marginInline: '1em', flexShrink: 0 }}
          >
            <FolderIcon /> Đường dẫn
          </Button>
          <Typography
            component="span"
            noWrap
            align="left"
            sx={{ flexShrink: 1 }}
          >
            {path}
          </Typography>
        </Box>

        <Box className="bg-component--dark" pl={1} p={2} mt={1}>
          <Box pb={1}>
            <Typography variant="h4" component="h2">
              Truyện mới cập nhập
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {results.map((item: IMangaSearchList, index) => {
              return (
                <Grid
                  item
                  xs={3}
                  rowSpacing={2}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  key={item.bgurl}
                >
                  <ResultCard item={item} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
        <Box
          className="bg-component--dark"
          pl={1}
          p={2}
          mt={1}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Button variant="contained"> {'<'} </Button>
          <Button variant="contained"> 1 </Button>
          <Button variant="text"> 2 </Button>
          <Button variant="text"> 3 </Button>
          <Button variant="text"> 4 </Button>
          <Button variant="text"> 5 </Button>
          <Button variant="text"> 6 </Button>
          <Button variant="text"> 7 </Button>
          <Button variant="text"> 8 </Button>
          <Button variant="text"> 9 </Button>
          <Button variant="text"> 10 </Button>
          <Button variant="contained"> {'>'} </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Index;
