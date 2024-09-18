import { FormEvent, useState } from "react";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { FerramentasDaListagem } from "../../shared/components";
import { Box } from "@mui/material";
import { useForm } from 'react-hook-form' 

export const FormBa: React.FC = () => {
    const { register } = useForm();

    const [name, setName] = useState('');
    const [age, setAge] = useState('');

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        console.log({name, age});
    }

    return (
        <LayoutBaseDePagina
        titulo="Página Inicial" 
        barraDeFerramentas={
        <FerramentasDaListagem
            mostrarBotaoNovo={false} />
        }>
            <Box>
        <form onSubmit={handleSave}>
            <fieldset>
                <legend>Fill the form</legend>

                <label>
                    <span>Name</span>
                    <br />

                    <input
                       
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

                    <input
                        type="number"
                        placeholder="Age"
                        {...register('age')}
                    />

                    <br/>
                    <span>Type the name here</span>
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