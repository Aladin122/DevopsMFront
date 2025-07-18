import axios from 'axios';
import { Contrat } from '../types/types';

const API_URL = `${import.meta.env.VITE_API_URL}/kaddem/contrat`;

export const getContrats = (): Promise<{ data: Contrat[] }> => {
  return axios.get(`${API_URL}/retrieve-all-contrats`);
};

export const getContratById = (id: number): Promise<{ data: Contrat }> => {
  return axios.get(`${API_URL}/retrieve-contrat/${id}`);
};

export const addContrat = (contrat: Contrat): Promise<any> => {
  return axios.post(`${API_URL}/add-contrat`, contrat);
};

export const updateContrat = (contrat: Contrat): Promise<any> => {
  return axios.put(`${API_URL}/update-contrat`, contrat);
};

export const deleteContrat = (id: number): Promise<any> => {
  return axios.delete(`${API_URL}/remove-contrat/${id}`);
};
