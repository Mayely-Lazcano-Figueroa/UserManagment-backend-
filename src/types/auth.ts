// Asegúrate de que este es el único lugar donde se definen estos tipos
export interface UserResponse {
  id: string; // ¡El campo que faltaba!
  name: string;
  email: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserResponse;
}
