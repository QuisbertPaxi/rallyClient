export interface ApiResponseConsurso
{
    id?: number | null,
    descripcion?: string | null,
    estado?: string | null,
    fecCre?: string | null |Date,
    fecMod?: string | null |Date,
    fechaAnuncio?: string | null |Date,
    fechaFinEnvio?: string | null |Date,
    fechaFinVotacion?: string | null |Date,
    fechaInicioEnvio?: string | null |Date,
    fechaInicioVotacion?: string | null |Date,
    numeroFotografias?: number | null,
    usuCre?: string | null,
    usuMod?: string | null
}
