import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { FolderGit2, LogOut, Settings, Home, Bot, Mail, FileText } from 'lucide-react';

import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Toolbar,
    Typography,
    Box,
    CssBaseline,
    Divider,
    Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {
    Users,
    GalleryThumbnails,
    Calendar,
    MessageSquareQuote,
    ShieldUser,
    Coins,
    ListCheck
} from 'lucide-react';
import UseAuth from '../hooks/useAuth';
import useCont from '../hooks/useCont';

const drawerWidth = 240;
const collapsedWidth = 72;

const AdminSidebar = () => {
    const { company } = useCont();
    const [open, setOpen] = useState(true);
    const location = useLocation();
    const { logout, user } = UseAuth({ middleware: 'auth' });

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const menuItems = [
        { text: 'Sliders', icon: <GalleryThumbnails size={20} />, path: '/admin-dash/sliders' },
        { text: 'Galería', icon: <GalleryThumbnails size={20} />, path: '/admin-dash/galeria' },
        // { text: 'Calendario', icon: <Calendar size={20} />, path: '/admin-dash' },
        // { text: 'Citas', icon: <ListCheck size={20} />, path: '/admin-dash/citas' },
        { text: 'Usuarios', icon: <Users size={20} />, path: '/admin-dash/pacientes' },
        // { text: 'Profesionales', icon: <ShieldUser size={20} />, path: '/admin-dash/doctores' },
        { text: 'Finanzas', icon: <Coins size={20} />, path: '/admin-dash/finanzas' },
        { text: 'Leads Contacto', icon: <Mail size={20} />, path: '/admin-dash/leads-contacto' },
        { text: 'Testimonios', icon: <MessageSquareQuote size={20} />, path: '/admin-dash/testimonios' },
        { text: 'Paquetes', icon: <FolderGit2 size={20} />, path: '/admin-dash/servicios' },
        { text: 'Posts', icon: <FileText size={20} />, path: '/admin-dash/posts' },
        { text: 'Configuraciones', icon: <Settings size={20} />, path: '/admin-dash/configuraciones' },
        { text: 'Chatbot', icon: <Bot size={20} />, path: '/admin-dash/chatbot' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: open ? drawerWidth : collapsedWidth,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    '& .MuiDrawer-paper': {
                        width: open ? drawerWidth : collapsedWidth,
                        transition: 'width 0.3s ease',
                        overflowX: 'hidden',
                        boxShadow: 2,
                    },
                }}
            >
                {/* Header mejorado */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        minHeight: 64,
                    }}
                >
                    {/* Logo/Inicio */}
                    {open ? (
                        <Box
                            component="a"
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                color: 'primary.main',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                            }}
                        >
                            {company.logo ? (
                                <img
                                    src={company.logo}
                                    alt={company.name || 'Logo'}
                                    style={{
                                        height: '40px',
                                        maxWidth: '100',
                                        objectFit: 'contain',
                                    }}
                                />
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Home size={24} />
                                    <Typography variant="h6" fontWeight={600}>
                                        {company.name || 'Panel Admin'}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <Tooltip title="Ver sitio web" placement="right">
                            <IconButton
                                component="a"
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                size="small"
                                sx={{
                                    color: 'primary.main',
                                    mx: 'auto',
                                }}
                            >
                                <Home size={24} />
                            </IconButton>
                        </Tooltip>
                    )}

                    {/* Toggle button */}
                    <Tooltip title={open ? 'Contraer menú' : 'Expandir menú'} placement="right">
                        <IconButton
                            onClick={handleDrawerToggle}
                            sx={{
                                ml: open ? 0 : 'auto',
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Divider />

                {/* Info del usuario (opcional) */}
                {open && user && (
                    <Box
                        sx={{
                            px: 2,
                            py: 1.5,
                            backgroundColor: 'grey.50',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" display="block">
                            Bienvenido,
                        </Typography>
                        <Typography variant="body2" fontWeight={600} noWrap>
                            {user.name || user.email}
                        </Typography>
                    </Box>
                )}

                {/* Menú principal */}
                <List sx={{ flexGrow: 1, py: 1 }}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <Tooltip
                                key={item.text}
                                title={!open ? item.text : ''}
                                placement="right"
                            >
                                <NavLink
                                    to={item.path}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <ListItemButton
                                        selected={isActive}
                                        sx={{
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                            mx: 1,
                                            mb: 0.5,
                                            borderRadius: 1,
                                            backgroundColor: isActive ? 'primary.light' : 'transparent',
                                            color: isActive ? 'primary.main' : 'text.primary',
                                            '&:hover': {
                                                backgroundColor: isActive ? 'primary.light' : 'grey.100',
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: 'primary.light',
                                                '&:hover': {
                                                    backgroundColor: 'primary.light',
                                                },
                                            },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 2 : 'auto',
                                                justifyContent: 'center',
                                                color: isActive ? 'primary.main' : 'text.secondary',
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        {open && (
                                            <ListItemText
                                                primary={item.text}
                                                primaryTypographyProps={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: isActive ? 600 : 500,
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </NavLink>
                            </Tooltip>
                        );
                    })}
                </List>

                <Divider />

                {/* Botón de logout */}
                <Tooltip title={!open ? 'Cerrar sesión' : ''} placement="right">
                    <ListItemButton
                        onClick={logout}
                        sx={{
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                            mx: 1,
                            my: 1,
                            borderRadius: 1,
                            backgroundColor: 'error.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'error.dark',
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 2 : 'auto',
                                justifyContent: 'center',
                                color: 'white',
                            }}
                        >
                            <LogOut size={20} />
                        </ListItemIcon>
                        {open && (
                            <ListItemText
                                primary="Cerrar sesión"
                                primaryTypographyProps={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                }}
                            />
                        )}
                    </ListItemButton>
                </Tooltip>
            </Drawer>

            <Box
                component="main"
                className="bg-gray-50 min-h-screen"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    transition: 'margin 0.3s ease',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminSidebar;