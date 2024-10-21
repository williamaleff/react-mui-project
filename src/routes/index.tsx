import { Navigate, Route, Routes } from "react-router-dom";
import { useDrawerContext } from "../shared/contexts";
import { useEffect } from "react";
import { Dashboard, ListagemDePessoas, DetalheDePessoas, ListagemDeSuporte, DetalheDeSuporte, ListagemDeChamado, DetalheDeChamado, ListagemDeCliente, DetalheDeCliente } from "../pages";
import { ListagemDeFuncoes } from "../pages/funcoes/ListagemDeFuncoes";
import { DetalheDeFuncoes } from "../pages/funcoes/DetalheDeFuncoes";
import { DetalheDeAgente } from "../pages/agente/DetalheDeAgente";
import { ListagemDeAgente } from "../pages/agente/ListagemDeAgente";
import { ListagemDeTipos } from "../pages/tipos/ListagemDeTipos";
import { DetalheDeTipos } from "../pages/tipos/DetalheDeTipos";

export const AppRoutes = () => {
    const { setDrawerOptions } = useDrawerContext();

    useEffect(() => {
        setDrawerOptions([
            {
                icon: 'home',
                path: '/pagina-inicial',
                label: 'Página inicial'
            },
            {
                icon: 'computer',
                path: '/chamado',
                label: 'Chamados'
            },
            {
                icon: 'people',
                path: '/cliente',
                label: 'Clientes'
            },           
            {
                icon:'badge',
                path: '/agente',
                label: 'Funcionários'
            },
            {
                icon: 'work',
                path: '/funcoes',
                label: 'Funcoes'
            },
            {
                icon: 'support',
                path: '/tipos',
                label: 'Tipos'
            }
        ])
    }, []);

    return (
        <Routes>
            <Route path="/pagina-inicial" element={<Dashboard />} />
            
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

            <Route path="*" element={<Navigate to="/pagina-inicial" />} />
        </Routes>
    );
}