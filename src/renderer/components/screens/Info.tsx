import { IMangaInfo } from 'interfaces';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

export const Info = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const link: string | null = searchParams.get('target');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [info, setinfo] = useState<IMangaInfo>();
  const [isCheckedAll, setisCheckedAll] = useState<boolean>(false);
  const [checkedList, setcheckedList] = useState<boolean[]>(
    Array(info?.chapters.length).fill(false)
  );
  const handleCheckBoxOnClick = (target: any) => {
    const tempArr = [...checkedList];
    const tempTargetIndex = target.target.name;
    if (tempArr[tempTargetIndex] === true) tempArr[tempTargetIndex] = false;
    else tempArr[tempTargetIndex] = true;
    setcheckedList(tempArr);
  };
  useEffect(() => {
    const getMangaInfo = async () => {
      if (link) {
        const rawInfo: IMangaInfo = await window.electron.crawler.getInfo(link);
        setinfo(rawInfo);
      }
    };
    getMangaInfo();
  }, [link]);
  // const onSubmit: SubmitHandler<any> = (data) => console.log(checkedList);

  const exportListChapter = info?.chapters.map((chapter, index) => {
    return (
      <div
        className={
          index % 2 === 0 ? 'bg-light border text-start ' : 'border text-start '
        }
        key={chapter.chapter}
        style={{ paddingLeft: '45%', cursor: 'pointer' }}
      >
        <div>
          {' '}
          <input
            className="form-check-input"
            type="checkbox"
            // name={index+''}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register(String(index))}
            // value={true}
            checked={checkedList[index]}
            onClick={(target) => handleCheckBoxOnClick(target)}
          />
          <strong
            role="button"
            tabIndex={0}
            onClick={() =>
              navigate(
                `/chapter?url=${chapter.url}&chapter=${chapter.chapter}&name=${
                  info.name
                }&purl=${info.chapters[index - 1].url}&pchapter=${
                  info.chapters[index - 1].chapter
                }&nurl=${info.chapters[index - 1].url}&nchapter=${
                  info.chapters[index - 1].chapter
                }&mangaurl=${link}`
              )
            }
            onKeyUp={() => {}}
          >
            {chapter.chapter}
          </strong>
        </div>
      </div>
    );
  });
  const handleCheckAllButtonOnClick = () => {
    if (isCheckedAll === true) {
      setisCheckedAll(false);
      setcheckedList(Array(info?.chapters.length).fill(false));
    } else {
      setisCheckedAll(true);
      setcheckedList(Array(info?.chapters.length).fill(true));
    }
  };
  const downLoadChapter = async (chapter: any) => {
    if (info) {
      await window.electron.crawler.download({
        name: info?.name,
        chapter: chapter.chapter,
        url: chapter.url,
      });
    }
  };
  const handleDownloadAll = async () => {
    if (info) {
      for (let i = 0; i < info.chapters.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await downLoadChapter(info.chapters[i]);
      }
    }
  };

  return (
    <div className="row text-center mt-4 px-4">
      <div className="col-lg-2 col-md-2 col-sm-12">
        <img
          src={info?.thumbnail}
          style={{ width: '70%', height: 'auto' }}
          alt="something"
        />
      </div>
      <div className="col-lg-8 col-md-12 col-sm-12 text-start py-3 px-4">
        {' '}
        <div>
          <h3>
            <button
              onClick={() => navigate('/')}
              type="button"
              className="btn btn-primary btn-floating shadow-0  mx-4"
            >
              <i className="fas fa-angle-left " />
            </button>
            <strong>
              {info?.name} ({info?.otherName})
            </strong>
          </h3>
        </div>
        <div>
          <h6>Tác giả: {info?.author}</h6>
        </div>
        <div>
          <h6>Trạng thái: {info?.status}</h6>
        </div>
        <div className="">
          <h6>
            Thể loại:{' '}
            {info?.tag.map((tag) => {
              return (
                <div key={tag} className="badge bg-primary mx-1">
                  {tag}
                </div>
              );
            })}
          </h6>
        </div>
        <div>
          <div>
            <p>
              <h6>Mô tả:</h6> {info?.summary}
            </p>
          </div>
        </div>
      </div>
      <form id="my-form">
        <div
          className="col-12  "
          style={{ height: '50vh', color: 'black', overflow: 'auto' }}
        >
          {exportListChapter}
        </div>
        <div className="col-12 my-4">
          <button
            type="button"
            onClick={() => handleCheckAllButtonOnClick()}
            className="btn btn-primary shadow-0 "
            style={{ backgroundColor: '#25d366', margin: '2px' }}
            onKeyUp={() => {}}
          >
            <i className="fas fa-check" />
            &#160; {isCheckedAll !== true ? 'Chọn tất cả' : 'Bỏ chọn tất cả'}
          </button>
          <button
            onClick={() => handleDownloadAll()}
            form="my-form"
            type="submit"
            className="btn btn-primary shadow-0 "
            style={{ margin: '2px' }}
          >
            <i className="fas fa-arrow-circle-down" />
            &#160; Tải các chương đã chọn
          </button>
          <button
            type="button"
            onClick={() => handleDownloadAll()}
            className="btn btn-danger shadow-0"
            style={{ margin: '2px' }}
          >
            <i className="fas fa-arrow-circle-down" /> &#160;Tải xuống toàn bộ
          </button>
        </div>
      </form>
    </div>
  );
};

export default Info;
