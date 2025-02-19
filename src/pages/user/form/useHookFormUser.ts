import { FieldValues, useForm } from "react-hook-form";
import { useRef, useCallback } from "react";
import { TFormDataUser } from "../../../shared/forms/TFormDataUser"; 

export const useHookFormUser = <TFormData extends FieldValues = TFormDataUser>() => {
    const {
        register,
        handleSubmit,
        reset,
        control, 
        watch,
        setError,
        setValue,
        clearErrors,
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
        clearErrors,
        setValue,
        errors
    };
};
