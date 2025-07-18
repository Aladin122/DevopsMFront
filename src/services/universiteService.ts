import axios from 'axios';
import { Universite } from '../types/types';

const API_URL = `${import.meta.env.VITE_API_URL}/kaddem/universite`;

export const getUniversites = (): Promise<{ data: Universite[] }> => {
  return axios.get(`${API_URL}/retrieve-all-universites`);
};

export const getUniversiteById = (id: number): Promise<{ data: Universite }> => {
  return axios.get(`${API_URL}/retrieve-universite/${id}`);
};
