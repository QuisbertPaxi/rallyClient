export interface ApiResponseFotografia
{
    id?: number | null,
    idParticipante?: number | null,
    descripcion?: string | null,
    titulo: string,
    link?: string | null,
    cantidadVotos: number,
    usu_aprobacion?: string | null,
    fec_aprobacion?: string | null | Date,
    estado?: string | null,
    usuCre: string | null,
    usuMod: string | null
}
