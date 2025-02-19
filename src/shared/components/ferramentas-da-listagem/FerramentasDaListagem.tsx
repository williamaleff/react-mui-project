import { Box, Button, Icon, List, ListItem, ListItemText, Paper, TextField, useTheme } from "@mui/material";
import { PatternFormat } from "react-number-format";
import { Environment } from "../../environment";
import { IListagemInterno, InternoService } from "../../services/api/interno/InternoService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IFerramentasDaListagemProps {
    textoDaBuscaFrequencia?: string;
    textoDaBusca?: string;
    textoDaData?: string;
    mostrarInputBuscaFrequencia?: boolean;
    mostrarInputBusca?: boolean;
    mostrarInputData?: boolean;
    aoMudarTextoDeBuscaFrequencia?: (novoTexto: string) => void;
    aoMudarTextoDeBusca?: (novotexto: string) => void;
    aoMudarTextoDaData?: (novaData: string) => void;
    textoBotaoNovo?: string;
    textoBotaoImpressao?: string;
    mostrarBotaoNovo?: boolean;
    mostrarBotaoImpressao?: boolean;
    aoClicarEmNovo?: () => void;
    aoClicarEmImpressao?: () => void;
}

export const FerramentasDaListagem: React.FC<IFerramentasDaListagemProps> = ({
    textoDaBuscaFrequencia = "",
    mostrarInputBuscaFrequencia = false,
    aoMudarTextoDeBuscaFrequencia,
    textoDaBusca = "",
    textoDaData = "",
    mostrarInputBusca = false,
    aoMudarTextoDeBusca,
    aoMudarTextoDaData,
    aoClicarEmNovo,
    aoClicarEmImpressao,
    textoBotaoNovo = "Novo",
    textoBotaoImpressao = "Imprimir",
    mostrarBotaoNovo = false,
    mostrarBotaoImpressao = false,
    mostrarInputData = false
}) => {
    const theme = useTheme();
    const navigate = useNavigate();

  // Estado local para controlar o valor do campo de busca e as sugestões
  const [searchTerm, setSearchTerm] = useState<string>(textoDaBuscaFrequencia);
  const [suggestions, setSuggestions] = useState<IListagemInterno[]>([]);

  // Busca os internos conforme o usuário digita (com debounce de 300ms)
  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const delayDebounceFn = setTimeout(() => {
        InternoService.getAll(1, searchTerm)
          .then(result => {
            if (!(result instanceof Error)) {
              setSuggestions(result.data);
            }
          });
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  // Atualiza o valor do campo e propaga a mudança para o componente pai
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    aoMudarTextoDeBuscaFrequencia?.(value);
  };

  // Ao selecionar um interno, navega para a rota de cadastro do cliente
  const handleSelectSuggestion = (interno: IListagemInterno) => {
    navigate(`/frequencia/${interno.id}`);
    setSearchTerm("");
    setSuggestions([]);
  };

    return (
        <Box>
        <Paper style={{ padding: theme.spacing(1), margin: theme.spacing(1) }}>
        <Box 
        height={theme.spacing(5)} 
        marginX={1} 
        padding={1} 
        paddingX={2} 
        display="flex" 
        gap={1} 
        alignItems="center" 
        
        >
            {mostrarInputBuscaFrequencia && (
            <TextField
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={Environment.INPUT_DE_BUSCA}
            />
          )}

            {mostrarInputBusca && (
                <TextField
                size="small"
                value={textoDaBusca}
                onChange={(e) => aoMudarTextoDeBusca?.(e.target.value)} 
                placeholder={Environment.INPUT_DE_BUSCA}
                />
    
            )}
            {mostrarInputData && (
                <PatternFormat
                    format='##/##/####'
                    mask='_'
                    allowEmptyFormatting

                    patternChar='#'
                    type="text"
                    displayType='input'

                    isAllowed={
                        (values)=>{
                            if(values.value.length > 8) return false;
                            return true;
                        }
                    }

                    customInput={TextField}
                    size="small"
                    value={textoDaData}
                    onChange={(e) => aoMudarTextoDaData?.(e.target.value)} 
                    placeholder='Data'
                />
    
            )}


            <Box flex={1} display="flex" justifyContent="end">
                {mostrarBotaoImpressao &&(
                    <Button
                    color="secondary"
                    disableElevation
                    variant="contained"
                    onClick={aoClicarEmImpressao}
                    startIcon={<Icon>print</Icon>}
                    >{textoBotaoImpressao}</Button>
                )}
                {mostrarBotaoNovo &&(
                    <Button
                    color="primary"
                    disableElevation
                    variant="contained"
                    onClick={aoClicarEmNovo}
                    startIcon={<Icon>add</Icon>}
                    >{textoBotaoNovo}</Button>
                )}
            </Box>
            
        </Box>
        </Paper>
      {/* Lista de sugestões abaixo do TextField */}
      {mostrarInputBuscaFrequencia && suggestions.length > 0 && (
        <Paper style={{ margin: theme.spacing(1), maxHeight: 200, overflowY: "auto" }}>
          <List>
            {suggestions.map((interno) => (
              <ListItem key={interno.id} button onClick={() => handleSelectSuggestion(interno)}>
                <ListItemText primary={interno.nome} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
        </Box>
    );
}