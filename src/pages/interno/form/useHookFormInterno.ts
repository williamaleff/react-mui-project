import { useForm } from "react-hook-form";
import { useRef, useCallback } from "react";
import { TFormDataInterno } from "../../../shared/forms/TFormDataInterno"; 

export const useHookFormInterno = () => {
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
    } = useForm<TFormDataInterno>();

    const isSavingAndClose = useRef(false);
    const isSavingAndNew = useRef(false);

    const onSubmit = useCallback((callback: (data: TFormDataInterno) => void) => {
        return (data: TFormDataInterno) => {
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
        handleSubmit: (callback: (data: TFormDataInterno) => void) => handleSubmit(onSubmit(callback)),
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
