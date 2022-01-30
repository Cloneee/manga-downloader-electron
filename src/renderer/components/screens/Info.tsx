import { IMangaInfo } from 'interfaces';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

type Props = {};

export const Info = (props: Props) => {
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit: SubmitHandler<any> = (data) => console.log(checkedList);

  const link: string | null = searchParams.get('target');
  const [info, setinfo] = useState<IMangaInfo>();
  const [isCheckedAll, setisCheckedAll] = useState<boolean>(false);
  const [checkedList, setcheckedList] = useState<boolean[]>(
    Array(info?.chapters.length).fill(true)
  );
  const handleCheckBoxOnClick = (target: any) => {
    let tempArr = [...checkedList];
    console.log(tempArr)
    let tempTargetIndex = target.target.name;
    if (tempArr[tempTargetIndex] === true) tempArr[tempTargetIndex] = false;
    else tempArr[tempTargetIndex] = true;
    setcheckedList(tempArr);
    console.log(tempArr)
    console.log(target.target.name);
  };
  useEffect(() => {
    const getMangaInfo = async () => {
      const rawInfo = await window.electron.crawler.getInfo(link + '');
      console.log(rawInfo);
      setinfo(rawInfo);
    };
    getMangaInfo();
   
  }, []);

  const exportListChapter = info?.chapters.map((chapter, index) => {
    return (
      <div
        className={
          index % 2 === 0 ? 'bg-light border text-start ' : 'border text-start '
        }
        key={chapter.chapter}
        style={{ paddingLeft: '45%' }}
      >
        <div>
          {' '}
          <strong>
            {' '}
            <input
              className="form-check-input"
              type="checkbox"
              // name={index+''}
              {...register(index + '')}
              // value={true}
              checked={checkedList[index]}
              onClick={(target) => handleCheckBoxOnClick(target)}
            />
            {chapter.chapter}
          </strong>
        </div>
      </div>
    );
  });
  const handleCheckAllButtonOnClick = () => {
    if (isCheckedAll === true) {
      setisCheckedAll(false)
      setcheckedList( Array(info?.chapters.length).fill(false))
    }
    else{
      setisCheckedAll(true);
      setcheckedList( Array(info?.chapters.length).fill(true))

    } 
  };
  return (
    <div className="row text-center mt-4 px-4">
      <div className="col-lg-2 col-md-2 col-sm-12">
        <img src={info?.thumbnail} style={{ width: '70%', height: 'auto' }} />
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
              <i className="fas fa-angle-left "></i>
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
            {info?.tag.map((tag, index) => {
              return (
                <div key={index} className="badge bg-primary mx-1">
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
      <form onSubmit={handleSubmit(onSubmit)} id="my-form">
        <div
          className="col-12  "
          style={{ height: '50vh', color: 'black', overflow: 'auto' }}
        >
          {exportListChapter}
        </div>
        <div className="col-12 my-4">
          <div
            onClick={() => handleCheckAllButtonOnClick()}
            className="btn btn-primary shadow-0 "
            style={{ backgroundColor: '#25d366', marginRight: '2px' }}
          >
            <i className="fas fa-check"></i>
            &#160; {isCheckedAll !== true ? 'Chọn tất cả' : 'Bỏ chọn tất cả'}
          </div>
          <button
            //   onClick={()=> handleViewManga()}
            form="my-form"
            type="submit"
            className="btn btn-primary shadow-0 "
            style={{ marginRight: '2px' }}
          >
            <i className="fas fa-arrow-circle-down"></i>
            &#160; Tải các chương đã chọn
          </button>
          <div
            className="btn btn-danger shadow-0"
            style={{ marginLeft: '2px' }}
          >
            <i className="fas fa-arrow-circle-down"></i> &#160;Tải xuống toàn bộ
          </div>
        </div>
      </form>
    </div>
  );
};
