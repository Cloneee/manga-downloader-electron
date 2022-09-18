import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { IMangaSearchList } from 'interfaces';
import { useNavigate } from 'react-router-dom';

type Props = {
  item: IMangaSearchList;
};

export const ResultCard = (props: Props) => {
  const { item } = props;
  const navigate = useNavigate();
  const handleViewManga = () => {
    navigate(`/info?target=${item.link}&name=${item.name}`);
  };
  return (
    <Card sx={{ width: 200 }}>
      <CardActionArea onClick={handleViewManga}>
        <CardMedia
          component="img"
          image={item.bgurl}
          alt={item.name}
          sx={{ maxHeight: 250 }}
        />
        <CardContent>
          <Typography noWrap variant="h6">
            {item.name}
          </Typography>
          <Typography noWrap variant="subtitle1">
            {item.lastChapter}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
export default ResultCard;
