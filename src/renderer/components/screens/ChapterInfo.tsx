import { Button, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const ChapterInfo = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mangaUrl: string | null = searchParams.get('mangaurl');
  const link: string | null = searchParams.get('url');
  const chapter: string | null = searchParams.get('chapter');
  const name: string | null = searchParams.get('name');

  // const nlink: string | null = searchParams.get('nurl');
  // const nchapter: string | null = searchParams.get('nchapter');

  // const plink: string | null = searchParams.get('purl');
  // const pchapter: string | null = searchParams.get('pchapter');

  const [listImageLink, setlistImageLink] = useState<string[]>([]);
  useEffect(() => {
    const getMangaInfo = async () => {
      let rawInfo: string[] = [];
      if (name && chapter && link) {
        rawInfo = await window.electron.crawler.getImages({
          name,
          chapter,
          url: link,
        });
      }
      setlistImageLink(rawInfo);
    };
    getMangaInfo();
  }, [chapter, name, link]);
  return (
    <Grid container direction="row" sx={{ color: 'white' }}>
      <Grid item xs={12} alignItems="center">
        <Button
          onClick={() => navigate(`/info?target=${mangaUrl}`)}
          type="button"
          className=""
        >
          Quay lại
        </Button>
        <strong>
          {name} | {chapter}
        </strong>
      </Grid>
      <Grid xs={12} sx={{ justifyContent: 'center' }}>
        <Button className="">Chương trước </Button>
        <Button className="">Chương sau </Button>
      </Grid>
      <Grid xs={3} />
      <Grid xs={6}>
        {listImageLink.map((url) => {
          return (
            <img
              src={url}
              key={url}
              style={{ width: '100%', height: 'auto', marginBottom: '1em' }}
              alt="i"
            />
          );
        })}
      </Grid>
      <Grid xs={3} />
    </Grid>
  );
};
export default ChapterInfo;
