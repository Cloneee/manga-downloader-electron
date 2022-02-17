import FolderIcon from '@mui/icons-material/Folder';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Grid, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { IMangaSearchList } from '../../../interfaces';
import { Menu } from '../common/Menu';
import { ResultCard } from '../common/ResultCard';

export const Index = () => {
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
  const handleSearch = async () => {
    const result = await window.electron.crawler.search(search);
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
      }, 300);
    }
  };

  return (
    <Grid container direction="row" alignItems="flex-start" pt={1}>
      <img
        src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/242e73121940413.61add7ea6286e.png"
        alt="anime"
        loading="lazy"
        style={{ width: '100%' }}
      />

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
            sx={{ paddingInline: '2em', marginInline: '1em' }}
          >
            <FolderIcon /> Đường dẫn
          </Button>
          ... {path.substring(path.length - 15, path.length)}
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
                  key={item.bgurl}
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

export default Index;
