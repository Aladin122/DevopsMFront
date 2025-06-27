import axios from 'axios';
import { Departement } from '../types/types';

const API_URL = `${import.meta.env.VITE_API_URL}/Kaddem/departement`;

export const getDepartements = (): Promise<{ data: Departement[] }> => {
  return axios.get(`${API_URL}/retrieve-all-departements`);
};

export const getDepartementById = (id: number): Promise<{ data: Departement }> => {
  return axios.get(`${API_URL}/retrieve-departement/${id}`);
};
