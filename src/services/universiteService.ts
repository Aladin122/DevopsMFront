import axios from 'axios';
import { Universite } from '../types/types';

const API_URL = `http://192.168.235.132:8089/Kaddem/universite`;

export const getUniversites = (): Promise<{ data: Universite[] }> => {
  return axios.get(`${API_URL}/retrieve-all-universites`);
};

export const getUniversiteById = (id: number): Promise<{ data: Universite }> => {
  return axios.get(`${API_URL}/retrieve-universite/${id}`);
};
