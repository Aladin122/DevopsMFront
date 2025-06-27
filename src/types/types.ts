export type Option = 'GAMIX' | 'SE' | 'SIM' | 'NIDS';

export interface Etudiant {
  idEtudiant: number;
  nomE: string;
  prenomE: string;
  op: Option;
}

  export interface Contrat {
    id: number;
    specialite: string;
    dateDebutContrat: string;
    dateFinContrat: string;
    archive: boolean;
    montantContrat: number;
  }
  
  export interface Departement {
    id: number;
    nomDepartement: string;
  }
  
  export interface Equipe {
    id: number;
    nomEquipe: string;
    niveau: string;
  }
  
  export interface Universite {
    id: number;
    nomUniversite: string;
  }
  