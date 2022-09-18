import { useNavigate } from 'react-router-dom';

import DownloadIcon from '@mui/icons-material/Download';
import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export const Menu = () => {
  const navigate = useNavigate();
  const handleClick = (url: string) => {
    navigate(url);
  };
  return (
    <Box sx={{ width: '100%', maxWidth: 360 }} className="bg-component--dark">
      <Divider />
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleClick('/');
              }}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Trang chủ" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DownloadIcon />{' '}
              </ListItemIcon>
              <ListItemText primary="Tải về" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <Divider />
    </Box>
  );
};

export default Menu;
