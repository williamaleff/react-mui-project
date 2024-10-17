import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDeDetalhe } from "../../shared/components";
import { Box, Grid, LinearProgress, Paper, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { IVFormErrors } from "../../shared/forms";
import { ClienteService } from "../../shared/services/api/cliente/ClienteService";
import { AutoCompleteFuncoes } from "../../shared/components/Autocomplete/AutoCompleteFuncoes";
import { useHookFormCliente } from "./form/useHookFormCliente";
import { TFormDataCliente as TFormData } from "./form/TFormDataCliente";

const formValidationSchema: yup.Schema<TFormData> = yup.object().shape({
  nome: yup.string().required().min(3),
  email: yup.string().required(),
  funcaoId: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required(),
  telefone: yup.string().min(9).required(),
  dataCriacao: yup.string().required(),
  nivelId: yup.number().required(),
  outros: yup.string().required(),
  foto: yup.string().required(),
  anexo: yup.string().required(),
});

export const DetalheDeCliente: React.FC = () => {
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
  } = useHookFormCliente();

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
      
      ClienteService.getById(Number(id))
      .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
              alert(result.message);
              navigate('/cliente');                    
          } else {
              setNome(result.nome);

              Object.entries(result).forEach( ([chave, valor]) => {
                setValue(chave as keyof TFormData, valor)} )

          }
      });
      
  } else {
    reset({
      nome: "",
      email: "",
      funcaoId: 0,
      telefone: "",
      dataCriacao: todayOfTheTime,
      nivelId: 0,
      outros: " ",
      foto: " ",
      anexo: " ",
    });
  }
  }, [id, setValue, reset]);

  const handleSave = (data: TFormData) => {
    formValidationSchema
      .validate(data, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === "novo") {
          ClienteService.create(dadosValidados).then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSavingAndClose.current) {
                navigate("/cliente");
              } else {
                navigate(`/cliente/detalhe/${result}`);
              }
            }
          });
        } else {
          ClienteService.updateById(Number(id), {
            id: Number(id),
            ...dadosValidados,
          }).then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
              alert(result.message);
            } else {
              if (isSavingAndClose.current) {
                navigate("/cliente");
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
          setError(key as keyof TFormData, { type: "manual", message: value });
        });
      });
  };

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
        ClienteService.deleteById(id)
        .then(result => {
            if (result instanceof Error) {
                alert(result.message);
            } else {
                alert("Registro apagado com sucesso!")
                navigate('/cliente');
            }
        });            
    }
}

  return (
    <LayoutBaseDePagina
      titulo={id === "novo" ? "Novo Cliente" : nome}
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
          aoClicarEmVoltar={() => navigate("/cliente")}
          aoClicarEmNovo={() => navigate("/cliente/detalhe/novo")}
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
                <TextField
                  placeholder="Nome"
                  label="Nome"
                  disabled={isLoading}
                  fullWidth
                  {...register("nome")}
                  error={!!errors.nome}
                  helperText={errors.nome ? errors.nome.message : ""}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <TextField
                  disabled={isLoading}
                  fullWidth
                  type="email"
                  label="Email"
                  placeholder="Email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                />
              </Grid>
            </Grid>          

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <AutoCompleteFuncoes
                  control={control}
                  name="funcaoId"
                  errors={errors}
                  isLoading={isLoading}
                  setBusca={setBusca}
                  busca={busca}
                  />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <Controller
                  name="telefone"
                  control={control}
                  render={({ field: { onChange, onBlur, name, value } }) => (
                    <PatternFormat
                      onChange={onChange}
                      onBlur={onBlur}
                      name={name}
                      value={value}
                      format="(##) # #### - ####"
                      mask="_"
                      allowEmptyFormatting
                      patternChar="#"
                      type="tel"
                      customInput={TextField}
                      size="small"
                      error={!!errors.telefone}
                      helperText={
                        errors.telefone ? errors.telefone.message : ""
                      }
                      placeholder="Telefone"
                      isAllowed={({ value }) => {
                        if (value.length > 11) return false;
                        return true;
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
  
          </Grid>
        </Box>
      </form>
    </LayoutBaseDePagina>
  );
};
