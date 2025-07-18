import axios from 'axios';
import { Departement } from '../types/types';

const API_URL = `http://192.168.235.132:8089/Kaddem/departement`;

export const getDepartements = (): Promise<{ data: Departement[] }> => {
  return axios.get(`${API_URL}/retrieve-all-departements`);
};

export const getDepartementById = (id: number): Promise<{ data: Departement }> => {
  return axios.get(`${API_URL}/retrieve-departement/${id}`);
};
