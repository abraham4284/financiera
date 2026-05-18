export type Zone = {
  idZone: number;
  name: string;
  description: string | null;
  is_active: boolean | 0 | 1;
  created_at: string;
};

export type ZoneCreateDTO = {
  name: string;
  description: string;
};

export type ZoneUpdateDTO = ZoneCreateDTO;

export type ZoneToggleStatusDTO = {
  is_active: boolean | 0 | 1;
};