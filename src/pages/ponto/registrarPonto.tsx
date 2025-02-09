import React from 'react';
import { getPorPeriodo, registrarPonto } from '../../shared/services/api/interno/ponto';
import { Box, Paper, useTheme } from '@mui/material';


const BotaoRegistrarPonto: React.FC = () => {
  const funcionarioId = 123; // Exemplo de ID do funcionário

  const handleClick = () => {
    registrarPonto(funcionarioId);
  };
  const handleClick2 = async () => {
    const resposta = await getPorPeriodo(2025,2);
    console.log(resposta);
  };
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
    <button onClick={handleClick}>
      Registrar Ponto
    </button>

    <button onClick={handleClick2}>
        Puxar dados
    </button>
    </Box>
  );
};

export default BotaoRegistrarPonto;
