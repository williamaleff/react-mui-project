import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "../../../shared/hooks";
import { FuncoesService } from "../../../shared/services/api/funcoes/FuncoesService";
import { useField } from "@unform/core";

type TAutoCompleteOption = {
    id: number;
    label: string;
}

interface IAutoCompleteFuncoesProps {
    isExternalLoading?: boolean;
}

export const AutoCompleteFuncoes: React.FC<IAutoCompleteFuncoesProps> = ({ isExternalLoading = false }) => {
    const { fieldName, registerField, defaultValue, error, clearError } = useField('funcaoId');
    const { debounce } = useDebounce();
    const [selectedId, setSelectedId] = useState<number | undefined>(defaultValue);
    const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [busca, setBusca] = useState('');

    useEffect(()=>{
        registerField({
            name: fieldName, 
            getValue: () => selectedId,
            setValue: (_, newSelectedId) => setSelectedId(newSelectedId),
        });
    },[registerField, fieldName, selectedId]);

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            FuncoesService.getAll(1, busca)
        .then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
               // alert(result.message);
            } else {
                console.log(result);

                setOpcoes(result.data.map(funcao => ({id: funcao.id, label: funcao.nome})));
            }
        });
        });
    },[busca])


    const autoCompleteSelectedOption = useMemo(()=>{
        if(!selectedId) return null;
        
        const selectedOption = opcoes.find(opcao => opcao.id === selectedId);
        if(!selectedOption) return null;

        return selectedOption;
    }, [selectedId, opcoes]);

    return (
        <Autocomplete
            openText="Abrir"
            closeText="Fechar"
            noOptionsText="Sem opções"
            loadingText="Carregando..."

            disablePortal

            value={autoCompleteSelectedOption}
            loading={isLoading}
            disabled={isExternalLoading}
            onChange={(_, newValue) => { setSelectedId(newValue?.id); setBusca(''); clearError();}}
            popupIcon={(isExternalLoading || isLoading) ? <CircularProgress size={28}/> : undefined}
            onInputChange={(_, newValue) => setBusca(newValue)}
            options={opcoes}
            renderInput={(params) => (
                <TextField 
                    {...params}
                    
                    label="Funcao"
                    error={!!error}
                    helperText={error}
                    />
            )} />
    );
};