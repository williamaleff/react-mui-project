import { Navigate, Route, Routes } from "react-router-dom";
import { useDrawerContext } from "../shared/contexts";
import { useEffect } from "react";
import { Dashboard, ListagemDePessoas, DetalheDePessoas, ListagemDeSuporte, DetalheDeSuporte } from "../pages";
import { ListagemDeCidades } from "../pages/cidades/ListagemDeCidades";
import { DetalheDeCidades } from "../pages/cidades/DetalheDeCidades";

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
                icon: 'location_city',
                path: '/cidades',
                label: 'Cidades'
            },
            {
                icon: 'people',
                path: '/pessoas',
                label: 'Pessoas'
            },
            {
                icon: 'computer',
                path: '/suporte',
                label: 'Suporte Sap'
            }
        ])
    }, []);

    return (
        <Routes>
            <Route path="/pagina-inicial" element={<Dashboard />} />
            
            <Route path="/pessoas" element={<ListagemDePessoas />} />
            <Route path="/pessoas/detalhe/:id" element={<DetalheDePessoas /> } />

            <Route path="/cidades" element={<ListagemDeCidades />} />
            <Route path="/cidades/detalhe/:id" element={<DetalheDeCidades /> } />

            <Route path="/suporte" element={<ListagemDeSuporte />} />
            <Route path="/suporte/detalhe/:id" element={<DetalheDeSuporte /> } />

            <Route path="*" element={<Navigate to="/pagina-inicial" />} />
        </Routes>
    );
}