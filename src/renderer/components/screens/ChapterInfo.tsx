import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

type Props = {};

export const ChapterInfo = (props: Props) => {
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();
  const mangaUrl: string | null = searchParams.get('mangaurl');
  const link: string | null = searchParams.get('url');
  const chapter: string | null = searchParams.get('chapter');
  const name: string | null = searchParams.get('name');

  const nlink: string | null = searchParams.get('nurl');
  const nchapter: string | null = searchParams.get('nchapter');

  const plink: string | null = searchParams.get('purl');
  const pchapter: string | null = searchParams.get('pchapter');

  const [listImageLink, setlistImageLink] = useState<string[]>([]);
  useEffect(() => {
    const getMangaInfo = async () => {
      const rawInfo = await window.electron.crawler.getImages({
        name: name + '',
        chapter: chapter + '',
        url: link + '',
      });
      console.log(rawInfo);
      setlistImageLink(rawInfo);
    };
    getMangaInfo();
  }, []);
  return (
    <div className="row  text-center">
      <div className="col-12 bg-danger text-start row " style={{ height: '3em' }}>
        <button
          onClick={() => navigate(`/info?target=${mangaUrl}`)}
          type="button"
          className="btn btn-danger btn-floating btn-lg shadow-0  mx-4 col-2"
        >
          <i className="fas fa-angle-left "></i>
        </button>
        <span className='text-center col-10 py-3' style={{color:"white"}}><strong>{name} | {chapter}</strong></span>
      </div>
      <div className='col-12 text-center my-4'>
      <button type="button" className="btn btn-danger shadow-0 px-4 mx-2"><i className="fas fa-angle-left"></i></button>
      <button type="button" className="btn btn-danger shadow-0 px-4 mx-2"><i className="fas fa-angle-right"></i></button>

      </div>
      <div className="col-lg-3 col-md-2 col-sm-0"></div>
      <div className="col-lg-6 col-md-8 col-sm-12 my-4">
        {listImageLink.map((url, index) => {
          return (
            <img
              src={url}
              key={index}
              style={{ width: '100%', height: 'auto' }}
            ></img>
          );
        })}
      </div>
    </div>
  );
};
