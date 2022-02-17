import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Box, Button, Checkbox, Chip, Grid } from '@mui/material';
import { IMangaInfo } from 'interfaces';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DownloadBar } from '../common/DownloadBar';

export const Info = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const link: string | null = searchParams.get('target');
  const [percentComplete, setpercentComplete] = useState<number>(0);
  const [downloadStatus, setdownloadStatus] = useState<string>('Đang bắt đầu');
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
          <Checkbox
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
        setdownloadStatus(`Đã tải ${i - 1} / ${info.chapters.length}`);
        setpercentComplete(Math.floor((i / (info.chapters.length - 1)) * 100));
      }
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid xs={3}>
        <img src={info?.thumbnail} style={{ width: '90%' }} alt="something" />
      </Grid>

      <Grid xs={9}>
        {' '}
        <Box>
          <h3>
            <Button
              onClick={() => navigate('/')}
              // type="button"
              // className="btn__primary"
            >
              <ArrowLeftIcon fontSize="large" />
            </Button>
            <strong>
              {info?.name} ({info?.otherName})
            </strong>
          </h3>
        </Box>
        <div>
          <h6>
            Tác giả: {info?.author} {percentComplete}
          </h6>
        </div>
        <div>
          <h6>Trạng thái: {info?.status}</h6>
        </div>
        <div className="">
          <h6>
            Thể loại:{' '}
            {info?.tag.map((tag) => {
              return (
                <Chip
                  sx={{ marginInlineEnd: '.5em', marginInlineStart: '.5em' }}
                  label={tag}
                  key={tag}
                  color="primary"
                />
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
      </Grid>
      <form id="my-form">
        <div
          className="col-12  "
          style={{ height: '50vh', color: 'black', overflow: 'auto' }}
        >
          {exportListChapter}
        </div>
        <div className="col-12 my-4">
          <Button
            type="button"
            onClick={() => handleCheckAllButtonOnClick()}
            style={{ backgroundColor: '#25d366', margin: '2px' }}
            onKeyUp={() => {}}
          >
            <i className="fas fa-check" />
            &#160; {isCheckedAll !== true ? 'Chọn tất cả' : 'Bỏ chọn tất cả'}
          </Button>
          <Button
            onClick={() => handleDownloadAll()}
            form="my-form"
            type="submit"
            style={{ margin: '2px' }}
          >
            <i className="fas fa-arrow-circle-down" />
            &#160; Tải các chương đã chọn
          </Button>
          <Button
            type="button"
            onClick={() => handleDownloadAll()}
            style={{ margin: '2px' }}
          >
            <i className="fas fa-arrow-circle-down" /> &#160;Tải xuống toàn bộ
          </Button>
        </div>
      </form>
      <Grid xs={12} sx={{ height: '70px' }} />
      {percentComplete}
      <DownloadBar status={downloadStatus} value={percentComplete} />
    </Grid>
  );
};

export default Info;
