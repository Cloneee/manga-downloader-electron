/* eslint-disable react/no-array-index-key */
import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const ChapterInfo = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const link: string | null = searchParams.get('url');
  const chapter: string | null = searchParams.get('chapter');
  const name: string | null = searchParams.get('name');
  const [listImageLink, setlistImageLink] = useState<string[]>([]);
  useEffect(() => {
    const getMangaInfo = async () => {
      let imagesURL: string[] = [];
      if (name && chapter && link) {
        imagesURL = await window.electron.crawler.getImages({
          name,
          chapter,
          url: link,
        });
      }
      setlistImageLink(imagesURL);
    };
    getMangaInfo();
  }, [chapter, name, link]);

  // TODO: Button, press to go to other chapter

  return (
    <Container>
      {listImageLink.map((image: string, index: number) => (
        <img
          src={image}
          style={{ width: '100%', height: 'auto' }}
          alt={`${name} - ${index}`}
          key={`${name} - ${index}`}
          loading="lazy"
        />
      ))}
    </Container>
  );
};
export default ChapterInfo;
