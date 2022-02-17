import { Box, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { IMangaSearchList } from 'interfaces';
import { useNavigate } from 'react-router-dom';

type Props = {
  item: IMangaSearchList;
};

export const ResultCard = (props: Props) => {
  const { item } = props;
  const navigate = useNavigate();

  const handleViewManga = () => {
    navigate(`/info?target=${item.link}`);
  };

  const downloadAll = () => {
    console.log(item);
  };
  return (
    <Box className="bg-component--dark">
      {/* <p className="card-text">{item.link}</p> */}

      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="300"
          image={item.bgurl}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {item.name.length < 25
              ? item.name
              : `${item.name.substring(0, 25)} ...`}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => handleViewManga()}>
            Xem
          </Button>
          <Button size="small" onClick={() => downloadAll()}>
            Tải toàn bộ
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
export default ResultCard;
