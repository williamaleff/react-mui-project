import React from 'react';
import { PontoService } from '../../shared/services/api/interno/PontoService';
import { Box, Paper, useTheme } from '@mui/material';


const BotaoRegistrarPonto: React.FC = () => {
  const funcionarioId = 123; // Exemplo de ID do funcionário

  const handleClick = () => {
    PontoService.registrarPonto(funcionarioId);
  };
  const handleClick2 = async () => {
    const resposta = await PontoService.getPorPeriodo(2025,2);
    console.log(resposta);
  };

  const handleClick3 = async () => {
    await PontoService.downloadRegistrosPDF(2025, 2);
  };

  const handleClick4 = async () => {
    await PontoService.downloadExcelRegistros(2025, 2);
  };
  
  const handleClick5 = async () => {
    const resposta = await PontoService.getRegistrosFuncionarioMes(123, 2025, 2);
    console.log(resposta)
  };

  const handleClick6 = async () => {
    const resposta = await PontoService.downloadRegistrosPDFporID(123, 2025, 2);
    console.log(resposta)
  };

  const handleClick7 = async () => {
    const resposta = await PontoService.downloadExcelRegistrosporId(123, 2025, 2);
    console.log(resposta)
  };

  const handleClick8 = async () => {
    const resposta = await PontoService.getHorasTrabalhadas(123, 2025, 2);
    console.log(resposta)
  };

  const handleClick9 = async () => {

    const dados ={
                    "fingerprint": "AQAAABQAAAAUAQAAAQASAAEAZAAAAAAACAEAAHeqESvH5rxtxAwymvwgYXlGYfILLULgTn9nugSiwqBMIZ5usvTrmgRC0Lu5Pp7LTnrEQjsF*IJSdMu7BpdsXXlgZ0AS8A9jBJjcr5GhTS8cHjtfDpvs5gVIxBqmOhjrVVtUgCf1d*v4dfDcPB5voYJ3dq3Ao/f53VSLlAEpjrj/OTFIAcS1n0bJPLbFouD*EgbkoFJ13JpxPdyw/lhl3GS9TkVuF2NuF9Jc4HrCp0*9qFhP2zkGzeIo/CPZGRoRTwEvlzjwsrfLAPUL3okDpRBHS6qUlFfPF90xKSouZPR7HPqkqBaiXuPi8tzqaI4B4F7snRXl*wcq1GlFABVC3NsK/EhwMtAbA9R/uGsAcRvM"
                 };
    const resposta = await PontoService.verifyFingerprint(dados);
    console.log(resposta)
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

    <button onClick={handleClick9}>
      verificar digital 1-n
    </button>

    <button onClick={handleClick}>
      Registrar Ponto
    </button>

    <button onClick={handleClick2}>
        Puxar dados
    </button>

    <button onClick={handleClick3}>
        Download pdf
    </button>

    <button onClick={handleClick4}>
        Download excel
    </button>

    <button onClick={handleClick5}>
        Puxar dados com id
    </button>

    <button onClick={handleClick6}>
        Download pdf com id
    </button>
 
    <button onClick={handleClick7}>
        Download excel com id
    </button>

    <button onClick={handleClick8}>
        Horas trabalhadas com id
    </button>
 
    </Box>
  );
};

export default BotaoRegistrarPonto;
