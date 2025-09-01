import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import List from '@mui/material/List'; 
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import Swal from 'sweetalert2';
import Logo from '../assets/Logo.png';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PeopleIcon from '@mui/icons-material/People';

const drawerWidth = 200;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      paddingLeft: '8px', 
      paddingRight: '8px', 
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }),
      height: '100vh',  
    }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0,0),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, authUser } = useAuth();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Log out",
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      window.location.href = '/PromotionProposal/';
    });
  };

  const getPageTitle = () => {
    const { pathname } = location;
  
    if (pathname === '/PromotionProposal/homepage') {
      return 'หน้าแรก';
    } else if (pathname === '/PromotionProposal/PromotionPage') {
      return 'Promotion';
    } else if (pathname.startsWith('/PromotionProposal/view')) {
      return 'View';
    } else if (pathname.startsWith('/PromotionProposal/edit')) {
      return 'แก้ไข';
    } else if (pathname.startsWith('/PromotionProposal/AddProduct')) {
      return 'เพิ่ม/ลบ สินค้า';
    } else if (pathname.startsWith('/PromotionProposal/adduser')) {
      return 'เพิ่ม/ลบ User';
    } else {
      return 'Persistent drawer';
    }
  };

  const menuItems = [
    { 
      text: 'หน้าแรก', 
      icon: <HomeIcon className="text-blue-300 transition-transform duration-200 hover:scale-150" />, 
      path: '/PromotionProposal/homepage',
      className: 'text-lg font-semibold transition-transform duration-200 hover:scale-150'
    },
    { 
      text: 'สร้างโปรโมชั่น', 
      icon: <LocalOfferIcon className="text-green-500 transition-transform duration-200 hover:scale-150" />, 
      path: '/PromotionProposal/PromotionPage',
      className: 'text-lg font-semibold transition-transform duration-200 hover:scale-150'
    },
    authUser.role_code === 'ADMIN' || authUser.role_code === 'Approved_Step2' || authUser.role_code === 'Approved_Step1'
      ? { 
          text: 'เพิ่ม/ลบ สินค้า', 
          icon: <AddCircleIcon className="text-red-500 transition-transform duration-200 hover:scale-150" />, 
          path: '/PromotionProposal/AddProduct',
          className: 'text-lg font-semibold transition-transform duration-200 hover:scale-150'
        } 
      : null,
    authUser.role_code === 'ADMIN'
      ? { 
          text: 'เพิ่ม/ลบ User', 
          icon: <PeopleIcon className="text-blue-300 transition-transform duration-200 hover:scale-150" />, 
          path: '/PromotionProposal/adduser',
          className: 'text-lg font-semibold transition-transform duration-200 hover:scale-150'
        } 
      : null,
    { 
      text: 'ออกจากระบบ', 
      icon: <ExitToAppIcon className="text-yellow-500 transition-transform duration-200 hover:scale-150" />, 
      action: handleLogout,
      className: 'text-lg font-semibold transition-transform duration-200 hover:scale-150'
    },
  ].filter(Boolean);  // กรองรายการที่เป็น null
  
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {getPageTitle()} 
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.primary.main, 
            color: '#fff', 
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <div className='flex flex-col'>
            <div className="flex justify-center items-center">
              <img src={Logo} alt="Logo" className="w-40 h-20 object-scale-down rounded-full" />
            </div>
            <div className='w-full flex justify-center items-center text-sm'>
              {authUser.nameEng}
            </div>
          </div>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => item.action ? item.action() : navigate(item.path)}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Main open={open}>
        <div className='flex w-full'>
          <DrawerHeader />
          <Outlet />
        </div>
      </Main>
    </Box>
  );
}
