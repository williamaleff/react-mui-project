import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { Box, Grid, LinearProgress, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { IVFormErrors } from "../../shared/forms";
import { ChamadoService } from "../../shared/services/api/chamado/ChamadoService";
import { TFormDataChamado } from "./form/TFormDataChamado";
import { useHookFormChamado } from "./form/useHookFormChamado"
import { AutoCompleteTipos } from "../../shared/components/Autocomplete/AutoCompleteTipos";
import { AutoCompleteCliente } from "../../shared/components/Autocomplete/AutoCompleteCliente";

const formValidationSchema: yup.Schema<TFormDataChamado> = yup.object().shape({
  tipoId: yup.number().required(),
  descricao: yup.string().required(),
  statusId: yup.number().required(),
  prioridadeId: yup.number().required(),    
  dataCriacao: yup.string().required(),
  dataAtualizacao: yup.string().required(),
  dataFechamento: yup.string().required(),
  clienteId: yup.number().required(),
  agenteId: yup.number().required(),
  chamadoGlpi: yup.string().required(),
  anexo: yup.string().required()
});

export const DetalheDeChamado: React.FC = () => {
  const { id = "novo" } = useParams<"id">();
  const [isLoading, setIsLoading] = useState(false);
  const [busca, setBusca] = useState("");
  const [nome, setNome] = useState('');

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    //isSavingAndNew,
    isSavingAndClose,
    //isSubmitting,
    reset,
    control,
    setError,
    setValue,
    errors,
  } = useHookFormChamado();

  /////////////////DATA//////////////////////////////////////

  const horarioAtual = new Date().toLocaleTimeString();
  const fullYear = new Date().getFullYear().toString();
  const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
  const day = new Date().getDate().toString().padStart(2, "0");
  const todayOfTheTime =
    fullYear + "-" + month + "-" + day + "T" + horarioAtual;

  //////////////////////////////////////////////////////////

  useEffect(() => {
    if (id !== 'novo') {
      setIsLoading(true);
      
      ChamadoService.getById(Number(id))
      .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
              alert(result.message);
              navigate('/chamado');                    
          } else {
              setNome(busca || result.descricao);

              Object.entries(result).forEach( ([chave, valor]) => {
                setValue(chave as keyof TFormDataChamado, valor)} )

          }
      });
      
  } else {
    reset({
      tipoId: undefined,
      descricao: "",
      statusId: 0,
      prioridadeId: 0,    
      dataCriacao: todayOfTheTime,
      dataAtualizacao: todayOfTheTime,
      dataFechamento: " ",
      clienteId: undefined,
      agenteId: 0,
      chamadoGlpi: " ",
      anexo: " ",
    });
  }
  }, [id, setValue, reset]);

  const handleSave = (data: TFormDataChamado) => {
    formValidationSchema
      .validate(data, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === "novo") {
          ChamadoService.create(dadosValidados).then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSavingAndClose.current) {
                navigate("/chamado");
              } else {
                navigate(`/chamado/detalhe/${result}`);
              }
            }
          });
        } else {
          ChamadoService.updateById(Number(id), {
            id: Number(id),
            ...dadosValidados,
          }).then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSavingAndClose.current) {
                navigate("/chamado");
              }
            }
          });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErrors = {};
        errors.inner.forEach((error) => {
          if (!error.path) return;
          
          validationErrors[error.path] = error.message;
        });
        Object.entries(validationErrors).forEach(([key, value]) => {
          setError(key as keyof TFormDataChamado, { type: "manual", message: value });
        });
      });
  };

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
        ChamadoService.deleteById(id)
        .then(result => {
            if (result instanceof Error) {
                alert(result.message);
            } else {
                alert("Registro apagado com sucesso!")
                navigate('/chamado');
            }
        });            
    }
}

  return (
    <LayoutBaseDePagina
      titulo={id === "novo" ? "Novo Chamado" : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Novo"
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== "novo"}
          mostrarBotaoApagar={id !== "novo"}
          aoClicarEmSalvar={handleSubmit(handleSave)}
          aoClicarEmSalvarEFechar={() => {
            isSavingAndClose.current = true;
            handleSubmit(handleSave)();
          }}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmVoltar={() => navigate("/chamado")}
          aoClicarEmNovo={() => navigate("/chamado/detalhe/novo")}
        />
      }
    >
      {isLoading && <LinearProgress variant="indeterminate" />}

      <form onSubmit={handleSubmit(handleSave)}>
        <Box
          margin={1}
          display="flex"
          flexDirection="column"
          component={Paper}
          variant="outlined"
        >
          <Grid container direction="column" padding={2} spacing={2}>
            {isLoading && (
              <Grid item>
                <LinearProgress variant="indeterminate" />
              </Grid>
            )}

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <AutoCompleteTipos
                  control={control}
                  name="tipoId"
                  errors={errors}
                  isLoading={isLoading}
                  setBusca={setBusca}
                  busca={busca}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <TextField
                  placeholder="Descrição"
                  label="Descrição"
                  type="text"
                  disabled={isLoading}
                  fullWidth
                  {...register("descricao")}
                  error={!!errors.descricao}
                  helperText={errors.descricao ? errors.descricao.message : ""}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <AutoCompleteCliente
                  control={control}
                  name="clienteId"
                  errors={errors}
                  isLoading={isLoading}
                />
              </Grid>
            </Grid>


            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <TextField
                  disabled={isLoading}
                  fullWidth
                  type="text"
                  label="Chamado GLPI"
                  placeholder="Chamado GLPI"
                  {...register("chamadoGlpi")}
                  error={!!errors.chamadoGlpi}
                  helperText={errors.chamadoGlpi ? errors.chamadoGlpi.message : ""}
                />
              </Grid>
            </Grid>          

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <TextField
                  disabled={isLoading}
                  fullWidth
                  type="datetime-local"
                  placeholder="Data"
                  {...register("dataCriacao")}
                  error={!!errors.dataCriacao}
                  helperText={
                    errors.dataCriacao ? errors.dataCriacao.message : ""
                  }
                />
              </Grid>
            </Grid>
            
          </Grid>
        </Box>
      </form>
    </LayoutBaseDePagina>
  );
};
