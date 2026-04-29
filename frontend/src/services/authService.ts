import axiosInstance from './axiosConfig';

export interface UsuarioAutenticado {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  precisaTrocarSenha: boolean;
}

interface LoginResponse {
  access_token: string;
  usuario: UsuarioAutenticado;
}

export const authService = {
  async login(email: string, senha: string) {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', {
      email,
      senha,
    });

    sessionStorage.setItem('authToken', response.data.access_token);
    sessionStorage.setItem('authUser', JSON.stringify(response.data.usuario));

    return response.data.usuario;
  },

  logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authUser');
  },

  isAuthenticated() {
    return Boolean(sessionStorage.getItem('authToken'));
  },

  getUser(): UsuarioAutenticado | null {
    const rawUser = sessionStorage.getItem('authUser');
    if (!rawUser) return null;

    try {
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  },
};
