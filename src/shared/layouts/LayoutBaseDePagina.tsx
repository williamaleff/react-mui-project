import { Avatar, Box, Card, CardContent, Grid, Icon, IconButton, Menu, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useDrawerContext } from "../contexts";
import { ReactNode, useState } from "react";

interface ILayoutBaseDePaginaProps {
    titulo: string;
    barraDeFerramentas?: ReactNode;
    children?: React.ReactNode;
}

export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({ children, titulo, barraDeFerramentas }) => {
    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery(theme.breakpoints.down('md'));

    const { toggleDrawerOpen } = useDrawerContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
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
                <Typography sx={{ marginRight: 1 }}>William Alefe</Typography>
                <Avatar>H</Avatar>
            </Box>
            <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Perfil</MenuItem>
                        <MenuItem onClick={handleClose}>Configurações</MenuItem>
                        <MenuItem onClick={handleClose}>Sair</MenuItem>
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