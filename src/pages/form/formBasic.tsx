import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDaListagem } from "../../shared/components";
import { Box, TextField } from "@mui/material";
import { Controller, useForm } from 'react-hook-form' 
import { PatternFormat } from "react-number-format";

type TFormData = {
    name: string,
    age: number,
    date: string,
    horario: string
}

export const FormBasic: React.FC = () => {
    const { register, control, handleSubmit } = useForm<TFormData>();

    const handleSave = (data:TFormData) => {

        console.log(data);
    }

    return (
        <LayoutBaseDePagina
        titulo="Página Inicial" 
        barraDeFerramentas={
        <FerramentasDaListagem
            mostrarBotaoNovo={false} />
        }>
            <Box>
        <form onSubmit={handleSubmit(handleSave, (erros)=>console.log(erros))}>
            <fieldset>
                <legend>Fill the form</legend>

                <label>
                    <span>Name</span>
                    <br />

                    <TextField
                       
                        placeholder="Name"
                        {...register('name')}
                    />

                    <br/>
                    <span>Type the name here</span>
                </label>

                <br/>
                <br/>

                <label>
                    <span>Age</span>
                    <br />

                    <TextField
                        type="number"
                        placeholder="Age"
                        {...register('age')}
                    />

                    <br/>
                    <span>Type the name here</span>
                </label>
                
                <br/>
                <br/>

                <label>
                    <span>Data</span>
                    <br />

                    <TextField
                        type="date"
                        placeholder="Data"
                        {...register('date')}
                    />

                    <br/>
                    <span>Type the data here</span>
                </label>

                <br/>
                <br/>

                <label>
                    <span>Horario</span>
                    <br />

                    <Controller
                        name="horario"
                        control={control}
                        defaultValue="" // Certifique-se de que o valor inicial está correto
                        render={({ field }) => (
                        <PatternFormat
                            format="##:##:##"
                            mask="_"
                            allowEmptyFormatting
                            patternChar="#"
                            type="text"
                            displayType="input"
                            customInput={TextField}
                            size="small"
                            placeholder="Horario"
                            {...field} // Desestruture o campo para passar os props corretamente
                            isAllowed={({ value }) => {
                                if (value.length > 6) return false;
                                    return true;
                             }}
                    />
                    )}
                />   
                    <br/>
                    <span>Type the horario here</span>
                </label>


                <br/>
                <br/>
                <br/>

                <button>
                    Submit
                </button>
            </fieldset>

        </form>
        </Box>
        </LayoutBaseDePagina>
    );
}