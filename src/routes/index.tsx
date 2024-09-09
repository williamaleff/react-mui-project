import { Navigate, Route, Routes } from "react-router-dom";
import { useDrawerContext } from "../shared/contexts";
import { useEffect } from "react";
import { Dashboard, ListagemDePessoas, DetalheDePessoas, ListagemDeSuporte, DetalheDeSuporte } from "../pages";
import { ListagemDeFuncoes } from "../pages/funcoes/ListagemDeFuncoes";
import { DetalheDeFuncoes } from "../pages/funcoes/DetalheDeFuncoes";
import { DetalheDeTipos } from "../pages/tipos/DetalheDeTipos";
import { ListagemDeTipos } from "../pages/tipos/ListagemDeTipos";

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
                path: '/suporte',
                label: 'Suporte'
            },
            {
                icon: 'people',
                path: '/pessoas',
                label: 'Pessoas'
            },           
            {
                icon: 'work',
                path: '/funcoes',
                label: 'Funcoes'
            },
            {
                icon: 'list',
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

            <Route path="/tipos" element={<ListagemDeTipos />} />
            <Route path="/tipos/detalhe/:id" element={<DetalheDeTipos /> } />

            <Route path="*" element={<Navigate to="/pagina-inicial" />} />
        </Routes>
    );
}