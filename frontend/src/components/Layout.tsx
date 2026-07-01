import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export function Layout(){ const {logout}=useAuth(); const links=['/','/calendar','/reservations','/create','/settings','/tables','/customers']; return <><AppBar position="sticky"><Toolbar><Typography variant="h6" sx={{flexGrow:1}}>Restaurante IA</Typography>{links.map(l=><Button key={l} color="inherit" component={Link} to={l}>{l==='/'?'Dashboard':l.slice(1)}</Button>)}<Button color="inherit" onClick={logout}>Salir</Button></Toolbar></AppBar><Container sx={{py:3}} maxWidth="xl"><Outlet/></Container></>; }
