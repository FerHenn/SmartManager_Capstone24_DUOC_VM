
export interface  Usuario{
    id: number;
    nombreUsuario: string;
    correo: string;
    role: string;
}


export interface PerfilUsuario  {
    id: number;
    nombreUsuario: string;
    correo: string;
    nombre: string;
    apellido: string;
    numero_telefonico: string;
    estado_activo: boolean;
    usuario_administrador: boolean;
    role: string;
}