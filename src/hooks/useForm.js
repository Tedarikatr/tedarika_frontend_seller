import { useState, useCallback, useEffect } from 'react';
import { validateForm, validateField } from '@/utils/validation';
import { handleError } from '@/utils/errorHandler';

export const useForm = (initialValues = {}, validationSchema = {}, options = {}) => {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    validateOnSubmit = true,
    onSubmit,
    onError
  } = options;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Form değerlerini güncelle
  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Anında validasyon
    if (validateOnChange && touched[name]) {
      const fieldSchema = validationSchema[name];
      if (fieldSchema) {
        const error = Array.isArray(fieldSchema) 
          ? validateField(value, fieldSchema)
          : fieldSchema(value);
        
        setErrors(prev => ({ 
          ...prev, 
          [name]: error 
        }));
      }
    }
  }, [validateOnChange, touched, validationSchema]);

  // Alan değişikliği
  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    const fieldValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
    
    setValue(name, fieldValue);
  }, [setValue]);

  // Alan odak kaybı
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validateOnBlur) {
      const fieldSchema = validationSchema[name];
      if (fieldSchema) {
        const error = Array.isArray(fieldSchema) 
          ? validateField(value, fieldSchema)
          : fieldSchema(value);
        
        setErrors(prev => ({ 
          ...prev, 
          [name]: error 
        }));
      }
    }
  }, [validateOnBlur, validationSchema]);

  // Alan odak kazanma
  const handleFocus = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  // Tüm formu validate et
  const validate = useCallback(() => {
    const newErrors = validateForm(values, validationSchema);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationSchema]);

  // Form gönderimi
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Tüm alanları touched yap
    const allTouched = {};
    Object.keys(validationSchema).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    // Validasyon
    if (validateOnSubmit) {
      const isValid = validate();
      if (!isValid) {
        if (onError) {
          onError({ type: 'VALIDATION', errors });
        }
        return false;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
      return true;
    } catch (error) {
      const handledError = handleError(error, 'Form Submission');
      if (onError) {
        onError(handledError);
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationSchema, validateOnSubmit, validate, onError, onSubmit]);

  // Formu sıfırla
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Belirli bir alanı sıfırla
  const resetField = useCallback((name) => {
    setValues(prev => ({ ...prev, [name]: initialValues[name] || '' }));
    setErrors(prev => ({ ...prev, [name]: null }));
    setTouched(prev => ({ ...prev, [name]: false }));
  }, [initialValues]);

  // Form geçerliliğini kontrol et
  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    const hasValues = Object.keys(values).some(key => values[key] !== '' && values[key] != null);
    setIsValid(!hasErrors && hasValues);
  }, [errors, values]);

  // Hata durumunu kontrol et
  const hasError = useCallback((fieldName) => {
    return touched[fieldName] && errors[fieldName];
  }, [touched, errors]);

  // Form durumunu kontrol et
  const isDirty = useCallback(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    
    // Actions
    setValue,
    handleChange,
    handleBlur,
    handleFocus,
    handleSubmit,
    resetForm,
    resetField,
    validate,
    
    // Helpers
    hasError,
    isDirty,
    getFieldError: (name) => errors[name],
    getFieldValue: (name) => values[name],
    setFieldValue: (name, value) => setValue(name, value),
    setFieldTouched: (name, touched = true) => setTouched(prev => ({ ...prev, [name]: touched }))
  };
}; 