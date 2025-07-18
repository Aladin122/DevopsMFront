import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/Kaddem/etudiant`;

export interface Etudiant {
  idEtudiant?: number;
  prenomE: string;
  nomE: string;
  op?: string; // Option field
  // Add other fields as per your entity
}

export const etudiantService = {
  // Get all students
  getEtudiants: async () => {
    const response = await axios.get(`${API_BASE_URL}/retrieve-all-etudiants`);
    return response.data;
  },

  // Get student by ID
  getEtudiantById: async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/retrieve-etudiant/${id}`);
    return response.data;
  },

  // Add new student
  addEtudiant: async (etudiant: Etudiant) => {
    const response = await axios.post(`${API_BASE_URL}/add-etudiant`, etudiant);
    return response.data;
  },

  // Update student
  updateEtudiant: async (etudiant: Etudiant) => {
    const response = await axios.put(`${API_BASE_URL}/update-etudiant`, etudiant);
    return response.data;
  },

  // Delete student
  deleteEtudiant: async (id: number) => {
    await axios.delete(`${API_BASE_URL}/remove-etudiant/${id}`);
  },

  // Assign student to department
  assignEtudiantToDepartement: async (etudiantId: number, departementId: number) => {
    await axios.put(`${API_BASE_URL}/affecter-etudiant-departement/${etudiantId}/${departementId}`);
  },

  // Add student with team and contract
  addEtudiantWithEquipeAndContract: async (etudiant: Etudiant, idContrat: number, idEquipe: number) => {
    const response = await axios.post(`${API_BASE_URL}/add-assign-Etudiant/${idContrat}/${idEquipe}`, etudiant);
    return response.data;
  },

  // Get students by department
  getEtudiantsByDepartement: async (idDepartement: number) => {
    const response = await axios.get(`${API_BASE_URL}/getEtudiantsByDepartement/${idDepartement}`);
    return response.data;
  }
};