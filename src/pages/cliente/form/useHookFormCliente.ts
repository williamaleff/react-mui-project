import { useForm } from "react-hook-form";
import { useRef, useCallback } from "react";
import { TFormData } from "../../../shared/forms/TFormData"; 

export const useHookFormCliente = () => {
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
    } = useForm<TFormData>();

    const isSavingAndClose = useRef(false);
    const isSavingAndNew = useRef(false);

    const onSubmit = useCallback((callback: (data: TFormData) => void) => {
        return (data: TFormData) => {
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
        handleSubmit: (callback: (data: TFormData) => void) => handleSubmit(onSubmit(callback)),
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
