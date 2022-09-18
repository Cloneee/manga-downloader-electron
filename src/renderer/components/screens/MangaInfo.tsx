import {
  Box,
  Button,
  Chip,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { IMangaInfo } from 'interfaces';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface IChapters {
  chapter: string;
  url: string;
}

export const Info = () => {
  const style = {
    details: { display: 'flex', gap: 2, alignItems: 'center' },
  };

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const link: string | null = searchParams.get('target');

  const [info, setInfo] = useState<IMangaInfo>();
  useEffect(() => {
    const getMangaInfo = async () => {
      if (link) {
        const rawInfo: IMangaInfo = await window.electron.crawler.getInfo(link);
        setInfo(rawInfo);
      }
    };
    getMangaInfo();
  }, [link]);

  const downLoadChapter = async (chapter: any) => {
    if (info) {
      await window.electron.crawler.download({
        name: info?.name,
        chapter: chapter.chapter,
        url: chapter.url,
      });
    }
  };

  const handleClickChapter = (
    chapter: string | undefined,
    url: string | undefined
  ) => {
    navigate(
      `/chapter?url=${url}&chapter=${chapter}&name=${info?.name}&target=${link}`
    );
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flexGrow: 0, flexShrink: 0 }}>
          <Box sx={{ maxWidth: 300 }}>
            <img
              src={info?.thumbnail}
              alt={info?.name}
              style={{ width: '100%', height: 'auto' }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              sx={{ flexGrow: 1 }}
              onClick={() => {
                handleClickChapter(
                  info?.chapters[info?.chapters.length - 1].chapter,
                  info?.chapters[info?.chapters.length - 1].url
                );
              }}
            >
              Chương đầu
            </Button>
            <Button
              variant="contained"
              sx={{ flexGrow: 1 }}
              onClick={() => {
                handleClickChapter(
                  info?.chapters[0].chapter,
                  info?.chapters[0].url
                );
              }}
            >
              Chương cuối
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            flexShrink: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography
            variant="h3"
            sx={{ textTransform: 'uppercase', fontWeight: 400 }}
          >
            {info?.name}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Thể loại:
            </Typography>
            {info?.tag.map((tag: string) => {
              return (
                <Chip
                  color="secondary"
                  label={tag}
                  clickable
                  sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                />
              );
            })}
          </Box>
          <Box sx={style.details}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Tên khác:
            </Typography>
            <Typography>{info?.otherName}</Typography>
          </Box>
          <Box sx={style.details}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Tác giả:
            </Typography>
            <Typography>{info?.author}</Typography>
          </Box>
          <Box sx={style.details}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Trạng thái:
            </Typography>
            <Chip
              label={info?.status}
              color="success"
              sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
            />
          </Box>
          <Box sx={style.details}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', flexShrink: 0 }}>
              Mô tả:
            </Typography>
            <Typography>{info?.summary}</Typography>
          </Box>
          <TableContainer sx={{ maxHeight: '50vh', overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#0f1325' }}>
                    <Typography variant="h6">Tên chapter</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ backgroundColor: '#0f1325' }}>
                    <Typography variant="h6">Downloaded</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {info?.chapters.map((item: IChapters, index) => (
                  <TableRow
                    // eslint-disable-next-line react/no-array-index-key
                    key={item.chapter + index}
                    hover
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      onClick={() => {
                        handleClickChapter(item.chapter, item.url);
                      }}
                    >
                      <Typography variant="body1">{item.chapter}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <CheckCircleIcon />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Container>
  );
};

export default Info;
