export interface Zone {
    idZone: number;
    name: string;
    description: string | null;
    is_active: 0 | 1;
    created_at: string;
  }
  
  export interface CreateZoneDTO {
    name: string;
    description?: string | null;
  }
  
  export interface UpdateZoneDTO {
    name: string;
    description?: string | null;
  }
  
  export interface ToggleZoneStatusDTO {
    is_active: 0 | 1;
  }