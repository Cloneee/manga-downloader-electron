import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

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
    <div className="row  text-center">
      <div
        className="col-12 bg-danger text-start row "
        style={{ height: '3em' }}
      >
        <button
          onClick={() => navigate(`/info?target=${mangaUrl}`)}
          type="button"
          className="btn btn-danger btn-floating btn-lg shadow-0  mx-4 col-2"
        >
          <i className="fas fa-angle-left " />
        </button>
      </div>
      <h4
        className="text-center col-10 py-2 mt-2 col-12"
        style={{ color: 'black' }}
      >
        <strong>
          {name} | {chapter}
        </strong>
      </h4>
      <div className="col-12 text-center my-1">
        <button type="button" className="btn btn-danger shadow-0 px-4 mx-2">
          <i className="fas fa-angle-left" />
        </button>
        <button type="button" className="btn btn-danger shadow-0 px-4 mx-2">
          <i className="fas fa-angle-right" />
        </button>
      </div>
      <div className="col-lg-3 col-md-2 col-sm-0" />
      <div className="col-lg-6 col-md-8 col-sm-12 my-4">
        {listImageLink.map((url) => {
          return (
            <img
              src={url}
              key={url}
              style={{ width: '100%', height: 'auto' }}
              alt="jcndkjsncs"
            />
          );
        })}
      </div>
    </div>
  );
};
export default ChapterInfo;
