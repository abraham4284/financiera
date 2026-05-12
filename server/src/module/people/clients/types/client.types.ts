export interface Client {
    idClient: number;
    first_name: string;
    last_name: string;
    dni: string | null;
    cuil: string | null;
    birth_date: string | null;
    maximum_indebtedness: string;
    is_active: 0 | 1;
    idZone: number;
    zone_name?: string;
  }
  
  export interface CreateClientDTO {
    first_name: string;
    last_name: string;
    dni?: string | null;
    cuil?: string | null;
    birth_date?: string | null;
    maximum_indebtedness: string;
    idZone: number;
  }
  
  export interface UpdateClientDTO extends CreateClientDTO {}
  
  export interface ToggleClientStatusDTO {
    is_active: 0 | 1;
  }