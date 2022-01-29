import { IMangaSearchList } from 'interfaces';
import React from 'react';

type Props = {
  item: IMangaSearchList;
};

export const ResultCard = (props: Props) => {
  const { item } = props;
  return (
    <div className="card row mx-1 my-3" style={{ marginBottom: '20px', }}>
        <div className='col-12' >
        <img
        style={{maxHeight: '250px', width: "auto"}}
        src={item.bgurl}
        className="card-img-top"
        alt="Fissure in Sandstone"
      />
        </div>
    
      <div className="card-body" data-mdb-toggle="tooltip" title={item.name}>
          <div className='d-flex justify-content-center' style={{minHeight: "4em"}}>
          <h5 className="card-title">{item.name.length < 25 ? item.name : item.name.substring(0,25)+ " ..." }
          
          </h5>
          </div>
         
          
       
        {/* <p className="card-text">{item.link}</p> */}
        <div  className="btn btn-primary shadow-0" style={{backgroundColor: '#ffac44' ,marginRight: "2px"}}>
        <i className="fas fa-eye"></i>
        </div>
        <div  className="btn btn-primary shadow-0" style={{backgroundColor: '#25d366', marginLeft: "2px"}}>
        <i className="fas fa-arrow-circle-down"></i>
        </div>
      </div>
    </div>
  );
};
