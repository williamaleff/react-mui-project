// src/shared/components/AutoCompleteCliente.tsx

import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Controller } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from "react";
import { ClienteService } from "../../services/api/cliente/ClienteService";

type TAutoCompleteOption = {
    id: number;
    label: string;
}

interface IAutoCompleteClienteProps {
    control: any; // Use o tipo correto para control
    name: string; // Nome do campo
    errors: any; // Use o tipo correto para erros
    isLoading: boolean;
}

export const AutoCompleteCliente: React.FC<IAutoCompleteClienteProps> = ({
    control,
    name,
    errors,
    isLoading,
}) => {
    const [selectedIdCliente, setSelectedIdCliente] = useState<number | undefined>();
    const [opcoesCliente, setOpcoesCliente] = useState<TAutoCompleteOption[]>([]);
    const [localBusca, setLocalBusca] = useState('');

    const useDebounceCliente = (callback: (...args: any[]) => void, delay: number) => {
        const debouncedCallback = useCallback((...args: any[]) => {
            const handler = setTimeout(() => {
                callback(...args);
            }, delay);
            return () => clearTimeout(handler);
        }, [callback, delay]);
    
        return debouncedCallback;
    };    

    const fetchDataCliente = useCallback(() => {
        ClienteService.getAll(1, localBusca)
            .then((result) => {
                if (result instanceof Error) {
                    console.error("Erro ao buscar dados:", result);
                } else {
                    setOpcoesCliente(result.data.map(funcao => ({ id: funcao.id, label: funcao.nome })));
                }
            });
    }, [localBusca]);

    const debouncedFetchDataCliente = useDebounceCliente(fetchDataCliente, 300); // 300ms de delay

    useEffect(() => {
        //setIsLoading(true);
        debouncedFetchDataCliente();
    }, [localBusca, debouncedFetchDataCliente]);
    
    const autoCompleteSelectedOptionCliente = useMemo(() => {
        if(!selectedIdCliente) return null;

        const selectedOptionCliente = opcoesCliente.find(opcao => opcao.id === selectedIdCliente);
        if(!selectedOptionCliente) return null;

        return selectedOptionCliente;
    }, [selectedIdCliente, opcoesCliente]);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {

                useEffect(() => {
                    setSelectedIdCliente(field.value);
                }, [field.value]);

                return(
                <Autocomplete
                    openText="Abrir"
                    closeText="Fechar"
                    noOptionsText="Sem opções"
                    loadingText="Carregando..."
                    disablePortal
                    value={autoCompleteSelectedOptionCliente}
                    loading={isLoading}
                    popupIcon={isLoading ? <CircularProgress size={28} /> : undefined}
                    onChange={(_, newValue) => {
                        field.onChange(newValue ? newValue.id : undefined);
                        setSelectedIdCliente(newValue ? newValue.id : undefined);
                        setLocalBusca(''); // Limpa a busca quando a opção é selecionada
                    }}
                    onInputChange={(_, newValue) => setLocalBusca(newValue)}
                    options={opcoesCliente}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Cliente"
                            error={!!errors[name]}
                            helperText={errors[name] ? errors[name].message : ''}
                        />
                    )}
                />
    )}}
        />
    );
};
