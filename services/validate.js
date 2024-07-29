import * as yup from 'yup';

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/
/**
 * Esquema para registro de usuario.
 */
export const schemaUserRegister = yup.object().shape({
    email: yup.string().min(3).email().required('El email es obligatorio.'),
    /*------------------------------------------------------------*/
    name: yup.string().min(3).required('El nombre es obligatorio.'),
    /*------------------------------------------------------------*/
    lastname: yup.string().min(3).required('El apellido es obligatorio.'),
    /*------------------------------------------------------------*/
    role_id: yup.string().min(3).required('El rol es obligatorio.'),
    /*------------------------------------------------------------*/
    password: yup.string().min(5).required('La contraseña es obligatoria.'),
}).noUnknown()
/*-------------------------------------------------------------------------------------------*/
/**
 * Esquema para acatualizar usuario.
 */
export const schemaUserUpdate = yup.object().shape({
    name: yup.string().min(3, 'Este campo debe tener como mínimo tres caracteres.').required('El nombre es obligatorio.'),
    /*------------------------------------------------------------*/
    lastname: yup.string().min(3, 'Este campo debe tener como mínimo tres caracteres.').required('El apellido es obligatorio.'),
}).noUnknown()
/*-------------------------------------------------------------------------------------------*/
/**
 * Esquema para acatualizar usuario.
 */
export const schemaUserUpdatePassword = yup.object().shape({
    password: yup.string()
        .min(6, "Verificar contraseña.")
        .required('La contraseña es obligatoria.'),
}).noUnknown()
/*-------------------------------------------------------------------------------------------*/
/**
 * Esquema para acatualizar usuario como super admin.
 */
export const schemaUserUpdateSA = yup.object().shape({
    name: yup.string().min(3, 'Este campo debe tener como mínimo tres caracteres.').required('El nombre es obligatorio.'),
    /*------------------------------------------------------------*/
    lastname: yup.string().min(3, 'Este campo debe tener como mínimo tres caracteres.').required('El apellido es obligatorio.'),
    /*------------------------------------------------------------*/
    role_id: yup.string().min(1).required('El role es obligatorio.'),
    /*------------------------------------------------------------*/
    softDelete: yup.string().min(1).required('El estado es obligatorio.'),
}).noUnknown()
/*-------------------------------------------------------------------------------------------*/
/*
|--------------------------------------------------------------------------
| Clients
|--------------------------------------------------------------------------
*/
export const schemaClientRegister = yup.object().shape({
    name_busines: yup.string().min(3).required('El nombre de la empresa es obligatorio.'),
    cuit_cuil: yup.string().min(11).required('El Cuit/Cuil es obligatorio.'),
    phone: yup.string().min(8).required('El telefono es obligatorio.'),
    email: yup.string().email().required('El email es obligatorio.'),
}).noUnknown()
/*-------------------------------------------------------------------------------------------*/
export const schemaClientUpdate = yup.object().shape({
    name_busines: yup.string().min(3).required('El nombre de la empresa es obligatorio.'),
    cuit_cuil: yup.string().min(11).required('El Cuit/Cuil es obligatorio.'),
    phone: yup.string().min(8).required('El telefono es obligatorio.'),
    email: yup.string().min(6).required('El email es obligatorio.'),
}).noUnknown()
/*--------------------------------------------------------------------------------------------*/
export const schemaClientUpdateService = yup.object().shape({
    service_id: yup.string().min(24).max(24).required('el ide del servicio es obligatorio.'),
}).noUnknown()
/*-------------------------------------------------------------------------------------------*/
/*
|--------------------------------------------------------------------------
| services
|--------------------------------------------------------------------------
*/
export const schemaServicesCreate = yup.object().shape({
    model: yup.string().min(3).required('El modelo del equipo es obligatorio.'),
    brand: yup.string().min(2).required('El nombre de la marca es obligatorio.'),
    serial_number: yup.string().min(6).required('El numero de serie es obligatorio.'),
    description: yup.string().min(10).required('La descripcion es obligatoria.'),
    client_id: yup.string().min(24).required('El cliente es obligatorio.'),
}).noUnknown()
/*-------------------------------------------------------------------------------------------*/
export const schemaServicesUpdate = yup.object().shape({
    model: yup.string().min(3).required('El modelo del equipo es obligatorio.'),
    brand: yup.string().min(2).required('El nombre de la marca es obligatorio.'),
    serial_number: yup.string().min(6).required('El numero de serie es obligatorio.'),
    client_id: yup.string().min(24).required('El cliente es obligatorio.'),
}).noUnknown()

export const schemaServicesStatusCreate = yup.object().shape({
    description: yup.string().min(10).required('La descripcion es obligatoria.'),
    state: yup.string().required('El estado es obligatorio.').oneOf(['Recepcionado', 'Revisado', 'Reparado', 'Sin reparación', 'Devuelto'], 'Estado no válido.')
}).noUnknown()

export const schemaServicesStatusDelete = yup.object().shape({
    state: yup.string().required('El estado a eliminar es obligatorio.').oneOf(['Recepcionado', 'Revisado', 'Reparado', 'Sin reparación', 'Devuelto'], 'Estado no válido.')
}).noUnknown()


export const schemaServicesStatusUpdate = yup.object().shape({
    state: yup.string().required('El estado es requerido'),
    description: yup.string()
      .max(140, 'La descripción no puede exceder los 140 caracteres')
      .min(10, 'La descripción debe tener al menos 10 caracteres')
      .required('La descripción es requerida'),
    date: yup.date().required('La fecha es requerida'),
  });
/*-------------------------------------------------------------------------------------------*/
/*
|--------------------------------------------------------------------------
| login
|--------------------------------------------------------------------------
*/
export const schemaLogin = yup.object().shape({
    email: yup.string().email().required('El email es obligatorio.'),
    password: yup.string().min(6).required('La contraseña es obligatoria.'),
}).noUnknown()
/*-------------------------------------------------------------------------------------------*/
/*
|--------------------------------------------------------------------------
| Recovery
|--------------------------------------------------------------------------
*/
export const schemaRecovery = yup.object().shape({
    email: yup.string()
        .email('El correo electrónico no es válido.')
        .required('El email es obligatorio.'),
}).noUnknown()
/*-------------------------------------------------------------------------------------------*/
/*
|--------------------------------------------------------------------------
| New password
|--------------------------------------------------------------------------
*/
export const schemaNewPassword = yup.object().shape({
    password: yup.string()
        .min(6, "Verificar contraseña.")
        .required('La contraseña es obligatoria.'),
    /*------------------------------------------------------------*/
    token: yup.string().min(10, "link invalido").required("link invalido"),
}).noUnknown()
/*-------------------------------------------------------------------------------------------*/