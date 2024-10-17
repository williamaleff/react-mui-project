import { useForm } from "react-hook-form";
import { useRef, useCallback } from "react";
import { TFormDataChamado } from "./TFormDataChamado";

export const useHookFormChamado = () => {
    const {
        register,
        handleSubmit,
        reset,
        control, 
        watch,
        setError,
        setValue,
        formState: { isSubmitting },
        formState: { errors }
    } = useForm<TFormDataChamado>();

    const isSavingAndClose = useRef(false);
    const isSavingAndNew = useRef(false);

    const onSubmit = useCallback((callback: (data: TFormDataChamado) => void) => {
        return (data: TFormDataChamado) => {
            callback(data);
            if (isSavingAndClose.current) {
                // Lógica para fechar o formulário
            }
            if (isSavingAndNew.current) {
                reset(); // Resetar o formulário para novos dados
            }
        };
    }, [reset]);

    return {
        register,
        handleSubmit: (callback: (data: TFormDataChamado) => void) => handleSubmit(onSubmit(callback)),
        isSavingAndNew,
        isSavingAndClose,
        isSubmitting,
        reset,
        control, 
        watch,
        setError,
        setValue,
        errors
    };
};
