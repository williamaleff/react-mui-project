// src/shared/components/AutoCompleteAgente.tsx

import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Controller } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from "react";
import { AgenteService } from "../../services/api/agente/AgenteService";

type TAutoCompleteOption = {
    id: number;
    label: string;
}

interface IAutoCompleteAgenteProps {
    control: any; // Use o tipo correto para control
    name: string;
    errors: any; // Use o tipo correto para erros
    isLoading: boolean;
    setBusca: (value: string) => void;
    busca: string;
    defaultValue?: number;
}

export const AutoCompleteAgente: React.FC<IAutoCompleteAgenteProps> = ({
    control,
    name,
    errors,
    isLoading,
    setBusca,
    busca,
    defaultValue
}) => {
    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([]);

    const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
        const debouncedCallback = useCallback((...args: any[]) => {
            const handler = setTimeout(() => {
                callback(...args);
            }, delay);
            return () => clearTimeout(handler);
        }, [callback, delay]);
    
        return debouncedCallback;
    };    

    const fetchData = useCallback(() => {
        AgenteService.getAll(1, busca)
            .then((result) => {
                if (result instanceof Error) {
                    console.error("Erro ao buscar dados:", result);
                } else {
                    setOpcoes(result.data.map(funcao => ({ id: funcao.id, label: funcao.nome })));
                }
            });
    }, [busca]);

    const debouncedFetchData = useDebounce(fetchData, 300); // 300ms de delay

    useEffect(() => {
        //setIsLoading(true);
        debouncedFetchData();
    }, [busca, debouncedFetchData]);
    
    const autoCompleteSelectedOption = useMemo(() => {
        if(!selectedId) return null;

        const selectedOption = opcoes.find(opcao => opcao.id === selectedId);
        if(!selectedOption) return null;

        return selectedOption;
    }, [selectedId, opcoes]);

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => {

                useEffect(() => {
                    setSelectedId(Number(field.value));
                }, [field.value]);

                return(
                <Autocomplete
                    openText="Abrir"
                    closeText="Fechar"
                    noOptionsText="Sem opções"
                    loadingText="Carregando..."
                    disablePortal
                    //value={field.value}
                    value={autoCompleteSelectedOption}
                    loading={isLoading}
                    popupIcon={isLoading ? <CircularProgress size={28} /> : undefined}
                    onChange={(_, newValue) => {
                        field.onChange(newValue ? newValue.id : undefined);
                        setSelectedId(newValue ? newValue.id : undefined);
                        setBusca(''); // Limpa a busca quando a opção é selecionada
                    }}
                    onInputChange={(_, newValue) => setBusca(newValue)}
                    options={opcoes}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Função"
                            error={!!errors[name]}
                            helperText={errors[name] ? errors[name].message : ''}
                        />
                    )}
                />
    )}}
        />
    );
};
