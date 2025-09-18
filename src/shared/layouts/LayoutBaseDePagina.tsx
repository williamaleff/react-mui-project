import { Avatar, Box, Card, CardContent, Grid, Icon, IconButton, Menu, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useAuthContext, useDrawerContext } from "../contexts";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ILayoutBaseDePaginaProps {
    titulo: string;
    barraDeFerramentas?: ReactNode;
    children?: React.ReactNode;
}

export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({ children, titulo, barraDeFerramentas }) => {
    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery(theme.breakpoints.down('md'));

    function stringToColor(string: string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    function stringAvatar(name: string) {
        const nameParts = name.split(' ');
        const initials =
            `${nameParts[0]?.[0] || ''}${nameParts[1]?.[0] || ''}`.toUpperCase();

        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: initials,
        };
    }


    const navigate = useNavigate();

    const { toggleDrawerOpen } = useDrawerContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { logout, authData } = useAuthContext();

    return (
        <Box height="100%" display="flex" flexDirection="column" gap={1}>
            <Box padding={1} display="flex" alignItems="center" gap={1} height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)} >
                {smDown && (
                    <IconButton onClick={toggleDrawerOpen}>
                        <Icon>menu</Icon>
                    </IconButton>
                )}
                <Grid container margin={1}>
                    <Grid item container spacing={1}>
                        <Grid item xs={6} sm={6} md={9} lg={10} xl={10}>
                            <Card sx={{ backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}>
                                <CardContent>
                                    <Typography
                                        overflow="hidden"
                                        whiteSpace="nowrap"
                                        textOverflow="ellipsis"
                                        variant={smDown ? "h5" : mdDown ? "h4" : "h3"}
                                    >
                                        {titulo}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} sm={6} md={3} lg={2} xl={2}>
                            <Card sx={{ backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" onClick={handleClick} sx={{ cursor: 'pointer' }}>
                                        <Typography sx={{ marginRight: 1 }}>{authData?.username || 'Admin'}</Typography>
                                        <Avatar alt={authData?.username} {...stringAvatar(`${authData?.username || 'Admin'}`)} />
                                    </Box>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >   {authData?.role === "ADMIN" && (
                                        <>
                                            <MenuItem onClick={() => navigate('/user')}>Perfil</MenuItem>
                                            <MenuItem onClick={() => navigate('/config')}>Configurações</MenuItem>
                                        </>
                                    )}
                                        <MenuItem onClick={logout}>Sair</MenuItem>
                                    </Menu>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>



            {barraDeFerramentas && (
                <Box>
                    {barraDeFerramentas}
                </Box>
            )}

            <Box flex={1} overflow="auto">
                {children}
            </Box>
        </Box>
    );
};