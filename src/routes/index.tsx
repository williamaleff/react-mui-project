import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext, useDrawerContext } from "../shared/contexts";
import { useEffect } from "react";
import { Dashboard } from "../pages";
import { ListagemDeInterno } from "../pages/interno/ListagemDeInterno";
import { DetalheDeInterno } from "../pages/interno/DetalheDeInterno";
import { Frequencia } from "../pages/frequencia/Frequencia";
import { Config } from "../pages/config/Config";
import ClockPage from "../pages/clockpage/ClockPage";
import { ListagemDeUser } from "../pages/user/ListagemDeUser";
import { DetalheDeUser } from "../pages/user/DetalheDeUser";

export const AppRoutes = () => {
    const { setDrawerOptions } = useDrawerContext();
    const { isAdmin } = useAuthContext();

    useEffect(() => {
        if (isAdmin) {
        setDrawerOptions([
              
            {
                icon: 'groupadd',
                path: '/interno',
                label: 'Biometria'
            },
            {
                icon: 'badge',
                path: '/frequencia/geral',
                label: 'Frequência'
            },
            {
                icon: 'support',
                path: '/config',
                label: 'Configuração'
            },
            {
                icon: 'people',
                path: '/user',
                label: 'Perfil'
            },
            {
                icon: 'analytics',
                path: '/dashboard',
                label: 'Dashboard'
            }
        ])
    }else{
        setDrawerOptions([
            {
              icon: "computer",
              path: "/clock",
              label: "Tela do Ponto",
            },
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

            <Route path="*" element={<Navigate to="/interno" />} />
            </>
        ) :(
            <>
          <Route path="/clock" element={<ClockPage />} />
          {/* Redireciona qualquer outra rota para /clock */}
          <Route path="*" element={<Navigate to="/clock" />} />
        </>
        )}
        </Routes>
    );
}