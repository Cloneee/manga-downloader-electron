import MenuBookIcon from '@mui/icons-material/MenuBook';
import { AppBar, Toolbar, Typography, Breadcrumbs } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const manga = searchParams.get('name') || '';
  const chapter = searchParams.get('chapter') || '';
  const mangaURL = searchParams.get('target') || '';

  const handleRedirect = (url: string) => {
    navigate(url);
  };

  return (
    <AppBar component="nav" sx={{ backgroundColor: '#0f1325' }}>
      <Toolbar>
        <MenuBookIcon sx={{ mr: 2 }} />
        <Breadcrumbs aria-label="breadcrumb">
          <Typography
            variant="h6"
            sx={{
              color: manga ? '' : 'white',
              ':hover': manga
                ? {
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }
                : '',
            }}
            onClick={() => handleRedirect('/')}
          >
            Fayaku Manga
          </Typography>
          {manga ? (
            <Typography
              noWrap
              variant="h6"
              sx={{
                color: chapter ? '' : 'white',
                ':hover': chapter
                  ? {
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }
                  : '',
              }}
              onClick={() =>
                handleRedirect(`/info?target=${mangaURL}&name=${manga}`)
              }
            >
              {manga}
            </Typography>
          ) : null}
          {chapter ? (
            <Typography
              noWrap
              variant="h6"
              sx={{
                color: 'white',
              }}
            >
              {chapter}
            </Typography>
          ) : null}
        </Breadcrumbs>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
