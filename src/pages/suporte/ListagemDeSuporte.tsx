import { useNavigate, useSearchParams } from "react-router-dom";
import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { useEffect, useMemo, useState } from "react";
import { IListagemSuporte, SuporteService } from "../../shared/services/api/suporte/SuporteService";
import { useDebounce } from "../../shared/hooks";
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { Environment } from "../../shared/environment";
import { useLocation } from 'react-router-dom';

 export const ListagemDeSuporte: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();

    const [rows, setRows] = useState<IListagemSuporte[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);


    const getCurrentDate = () => {
    const fullYear = new Date().getFullYear().toString();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');
    return `${day}/${month}/${fullYear}`;
};

    const [buscaData1, setBuscaData] = useState('');
    const location = useLocation();  // Obtém o objeto location do react-router-dom

    useEffect(() => {
        // Verifica o pathname da URL para determinar se é o link específico
        if (location.pathname === '/suporte') {
             // Se a data de hoje não estiver no localStorage, define a data atual
             const storedValue = localStorage.getItem('buscaData');
             if (!storedValue || storedValue === getCurrentDate()) {
                 const currentDate = getCurrentDate();
                 setBuscaData(currentDate);
                 localStorage.setItem('buscaData', currentDate);
             }
        }
    }, [location.pathname]);  // Dependência em location.pathname para detectar navegações

    useEffect(() => {
        // Inicializa buscaData com o valor do localStorage na primeira renderização
        const storedValue = localStorage.getItem('buscaData');
        if (storedValue) {
            setBuscaData(storedValue);
        }
    }, []);  // Executado apenas uma vez na montagem do componente


    const buscaData = useMemo(() => {
        // Obtém o valor do parâmetro buscaData se disponível
        const buscaDataParam = searchParams?.get('buscaData') || '';

        // Se o valor do parâmetro estiver vazio, usa o valor armazenado
        if (location.pathname === '/suporte') {
        return buscaDataParam.trim() === '' ? buscaData1 : buscaDataParam;
        }
        return buscaDataParam;
    }, [searchParams, buscaData1]);

    const busca = useMemo(()=>{
        return searchParams.get('busca') || '';
    },[searchParams]);

    const pagina = useMemo(()=>{
        return Number(searchParams.get('pagina') || '1');
    },[searchParams]);

    const paginaDate = useMemo(()=>{
        return Number(searchParams.get('paginaDate') || '1');
    },[searchParams]);

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            SuporteService.getAll(pagina, busca)
        .then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
                alert(result.message);
            } else {
                console.log(result);

                setTotalCount(result.totalCount);
                setRows(result.data);
            }
        });
        });
    },[busca, pagina])

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            SuporteService.getDate(paginaDate, buscaData)
        .then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
                alert(result.message);
            } else {
                console.log(result);

                setTotalCount(result.totalCount);
                setRows(result.data);
            }
        });
        });
    },[buscaData, paginaDate])

    useEffect(() => {
       
    },[])


    const handleDelete = (id: number) => {
        if (confirm('Realmente deseja apagar?')) {
            SuporteService.deleteById(id)
            .then(result => {
                if(result instanceof Error) {
                    alert(result.message);
                } else {
                    setRows(oldRows => [
                        ...oldRows.filter(oldRow => oldRow.id !== id)
                    ]);
                    alert('Registro apagado com sucesso!');
                }
            });
        }
    };

    return (
        <LayoutBaseDePagina
            titulo="Suporte da Sap"
            barraDeFerramentas={
                <FerramentasDaListagem
                mostrarInputBusca 
                mostrarInputData
                textoBotaoNovo="Novo"
                aoClicarEmNovo={() => navigate('/suporte/detalhe/novo')}
                textoDaBusca={busca}
                textoDaData={buscaData}
                aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
                aoMudarTextoDaData={texto => setSearchParams({ buscaData: texto, paginaDate: '1' }, { replace: true })}
                />
            }>

            <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width={70}>Ações</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Descrição</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        
                        {rows.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <IconButton size="small" onClick={() => handleDelete(row.id)}>
                                        <Icon>delete</Icon>
                                    </IconButton>
                                    <IconButton size="small" onClick={() => navigate(`/suporte/detalhe/${row.id}`)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                </TableCell>
                                <TableCell>{row.tipoId}</TableCell>
                                <TableCell>{row.descricao}</TableCell>
                            </TableRow>
                        ))}

                    </TableBody>

                        {totalCount === 0 && !isLoading &&(
                            <caption>{Environment.LISTAGEM_VAZIA}</caption>
                        )}

                    <TableFooter>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <LinearProgress variant="indeterminate" />
                                </TableCell>
                            </TableRow>
                        )}
                        {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS && busca!='') && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Pagination
                                    page={pagina} 
                                    count={Math.ceil(totalCount/Environment.LIMITE_DE_LINHAS)} 
                                    onChange={(_, newPage) => setSearchParams({ busca, pagina: newPage.toString() },{ replace: true })} />
                                </TableCell>
                            </TableRow>
                        )}
                        {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS && buscaData!='') && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Pagination
                                    page={paginaDate} 
                                    count={Math.ceil(totalCount/Environment.LIMITE_DE_LINHAS)} 
                                    onChange={(_, newPage) => setSearchParams({ buscaData, paginaDate: newPage.toString() },{ replace: true })} />
                                </TableCell>
                            </TableRow>
                        )}

                    </TableFooter>
                </Table>
            </TableContainer>

        </LayoutBaseDePagina>
    )
 };