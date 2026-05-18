export type Client = {
  idClient: number;
  first_name: string;
  last_name: string;
  dni: string;
  cuil: string;
  birth_date: string;
  observations: string | null;
  is_active: boolean | 0 | 1;
  maximum_indebtedness: string | number;
  created_at: string;
  idZone: number;
  zone_name?: string;
};

export type ClientCreateDTO = {
  first_name: string;
  last_name: string;
  dni: string;
  cuil: string;
  birth_date: string;
  observations?: string;
  maximum_indebtedness: string;
  idZone: number;
};

export type ClientUpdateDTO = ClientCreateDTO;

export type ClientToggleStatusDTO = {
  is_active: boolean | 0 | 1;
};