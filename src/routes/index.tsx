import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext, useDrawerContext } from "../shared/contexts";
import { useEffect } from "react";
import { Dashboard } from "../pages";
import { ListagemDeInterno } from "../pages/interno/ListagemDeInterno";
import { DetalheDeInterno } from "../pages/interno/DetalheDeInterno";
import { Frequencia } from "../pages/frequencia/Frequencia.tsx";
import { Config } from "../pages/config/Config";
import ClockPage from "../pages/clockpage/ClockPage";
import { ListagemDeUser } from "../pages/user/ListagemDeUser";
import { DetalheDeUser } from "../pages/user/DetalheDeUser";
import { GroupAdd, Badge, Support, People, Analytics } from "@mui/icons-material";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Malote } from "../pages/malote/Malote.tsx";
import Monitoramento from "../pages/monitoramento/Monitoramento.tsx"
import DashboardIcon from "@mui/icons-material/Dashboard";


export const AppRoutes = () => {
    const { setDrawerOptions } = useDrawerContext();
    const { isAdmin } = useAuthContext();

    useEffect(() => {
        if (isAdmin) {
        setDrawerOptions([
              
            {
                icon: <GroupAdd />,
                path: '/interno',
                label: 'Biometria'
            },
            {
                icon: <Badge />,
                path: '/frequencia/geral',
                label: 'Frequência'
            },
            {
                icon: <Support />,
                path: '/config',
                label: 'Atualização'
            },
            {
                icon: <ShoppingBagIcon />,
                path: '/malote',
                label: 'Malote'
            },
            {
                icon: <People />,
                path: '/user',
                label: 'Perfil'
            },
            {
                icon: <Analytics />,
                path: '/dashboard',
                label: 'Dashboard'
            },
            {
                icon: <DashboardIcon />,
                path: '/monitoramento',
                label: 'Monitoramento'
            }
        ])
    }else{
        setDrawerOptions([
            {
                icon: <ShoppingBagIcon />,
                path: '/malote',
                label: 'Malote'
            },
            // {
            //   icon: <Computer />,
            //   path: "/clock",
            //   label: "Tela do Ponto",
            // },
          ]);
    }
    }, [isAdmin, setDrawerOptions]);

    return (
        <Routes>
            {isAdmin ? (
            <>
            <Route path="/dashboard" element={<Dashboard />} />             
           
            <Route path="/interno" element={<ListagemDeInterno />} />
            <Route path="/interno/detalhe/:id" element={<DetalheDeInterno /> } />

            <Route path="/user" element={<ListagemDeUser />} />
            <Route path="/user/detalhe/:id" element={<DetalheDeUser /> } />

            <Route path="/frequencia/:id" element={<Frequencia />} />

            <Route path="/clock" element={<ClockPage />} />

            <Route path="/config" element={<Config />} />

            <Route path="/malote" element={<Malote />} />

            <Route path="/monitoramento" element={<Monitoramento />} />

            <Route path="*" element={<Navigate to="/interno" />} />
            </>
        ) :(
            <>
          <Route path="/malote" element={<Malote />} />
          {/* <Route path="/clock" element={<ClockPage />} /> */}
          
          {/* Redireciona qualquer outra rota para /clock */}
          <Route path="*" element={<Navigate to="/malote" />} />
        </>
        )}
        </Routes>
    );
}