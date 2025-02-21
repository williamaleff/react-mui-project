import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext, useDrawerContext } from "../shared/contexts";
import { useEffect } from "react";
import { Dashboard, ListagemDePessoas, DetalheDePessoas, ListagemDeSuporte, DetalheDeSuporte, ListagemDeChamado, DetalheDeChamado, ListagemDeCliente, DetalheDeCliente } from "../pages";
import { ListagemDeFuncoes } from "../pages/funcoes/ListagemDeFuncoes";
import { DetalheDeFuncoes } from "../pages/funcoes/DetalheDeFuncoes";
import { DetalheDeAgente } from "../pages/agente/DetalheDeAgente";
import { ListagemDeAgente } from "../pages/agente/ListagemDeAgente";
import { ListagemDeTipos } from "../pages/tipos/ListagemDeTipos";
import { DetalheDeTipos } from "../pages/tipos/DetalheDeTipos";
import { ListagemDeInterno } from "../pages/interno/ListagemDeInterno";
import { DetalheDeInterno } from "../pages/interno/DetalheDeInterno";
import { Frequencia } from "../pages/frequencia/Frequencia";
import { Config } from "../pages/config/Config";
import BotaoRegistrarPonto from "../pages/ponto/registrarPonto";
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
                label: 'Internos'
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
            
            <Route path="/pessoas" element={<ListagemDePessoas />} />
            <Route path="/pessoas/detalhe/:id" element={<DetalheDePessoas /> } />

            <Route path="/funcoes" element={<ListagemDeFuncoes />} />
            <Route path="/funcoes/detalhe/:id" element={<DetalheDeFuncoes /> } />

            <Route path="/suporte" element={<ListagemDeSuporte />} />
            <Route path="/suporte/detalhe/:id" element={<DetalheDeSuporte /> } />

            <Route path="/agente" element={<ListagemDeAgente />} />
            <Route path="/agente/detalhe/:id" element={<DetalheDeAgente /> } />
            
            <Route path="/chamado" element={<ListagemDeChamado />} />
            <Route path="/chamado/detalhe/:id" element={<DetalheDeChamado /> } />

            <Route path="/cliente" element={<ListagemDeCliente />} />
            <Route path="/cliente/detalhe/:id" element={<DetalheDeCliente /> } />

            <Route path="/tipos" element={<ListagemDeTipos />} />
            <Route path="/tipos/detalhe/:id" element={<DetalheDeTipos /> } />

            <Route path="/interno" element={<ListagemDeInterno />} />
            <Route path="/interno/detalhe/:id" element={<DetalheDeInterno /> } />

            <Route path="/user" element={<ListagemDeUser />} />
            <Route path="/user/detalhe/:id" element={<DetalheDeUser /> } />

            <Route path="/frequencia/:id" element={<Frequencia />} />

            <Route path="/ponto" element={<BotaoRegistrarPonto/>} />

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