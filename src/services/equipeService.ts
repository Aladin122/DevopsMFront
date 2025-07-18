import axios from 'axios';
import { Equipe } from '../types/types';

const API_URL = `${import.meta.env.VITE_API_URL}/kaddem/equipe`;

export const getEquipes = (): Promise<{ data: Equipe[] }> => {
  return axios.get(`${API_URL}/retrieve-all-equipes`);
};

export const getEquipeById = (id: number): Promise<{ data: Equipe }> => {
  return axios.get(`${API_URL}/retrieve-equipe/${id}`);
};
