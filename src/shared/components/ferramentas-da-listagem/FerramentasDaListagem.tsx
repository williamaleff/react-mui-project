import { Box, Button, Icon, Paper, TextField, useTheme } from "@mui/material";
import { Environment } from "../../environment";

interface IFerramentasDaListagemProps {
    textoDaBusca?: string;
    textoDaData?: string;
    mostrarInputBusca?: boolean;
    mostrarInputData?: boolean;
    aoMudarTextoDeBusca?: (novotexto: string) => void;
    aoMudarTextoDaData?: (novaData: string) => void;
    textoBotaoNovo?: string;
    mostrarBotaoNovo?: boolean;
    aoClicarEmNovo?: () => void;
}

export const FerramentasDaListagem: React.FC<IFerramentasDaListagemProps> = ({
    textoDaBusca = "",
    textoDaData = "",
    mostrarInputBusca = false,
    aoMudarTextoDeBusca,
    aoMudarTextoDaData,
    aoClicarEmNovo,
    textoBotaoNovo = "Novo",
    mostrarBotaoNovo = true,
    mostrarInputData = false
}) => {
    const theme = useTheme();

    return (
        <Box 
        height={theme.spacing(5)} 
        marginX={1} 
        padding={1} 
        paddingX={2} 
        display="flex" 
        gap={1} 
        alignItems="center" 
        component={Paper}
        >
            {mostrarInputBusca && (
                <TextField
                size="small"
                value={textoDaBusca}
                onChange={(e) => aoMudarTextoDeBusca?.(e.target.value)} 
                placeholder={Environment.INPUT_DE_BUSCA}
                />
    
            )}
            {mostrarInputData && (
                <TextField
                size="small"
                value={textoDaData}
                onChange={(e) => aoMudarTextoDaData?.(e.target.value)} 
                placeholder='Data'
                />
    
            )}


            <Box flex={1} display="flex" justifyContent="end">
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
    );
}