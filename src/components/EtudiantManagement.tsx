import React, { useState } from 'react';
import EtudiantList from './EtudiantList';
import EtudiantForm from './EtudiantForm';
import EtudiantDetails from './EtudiantDetails';
import { Etudiant } from '../services/etudiantService';

const EtudiantManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEtudiant, setSelectedEtudiant] = useState<Etudiant | undefined>();
  const [isEdit, setIsEdit] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAdd = () => {
    setSelectedEtudiant(undefined);
    setIsEdit(false);
    setShowForm(true);
  };

  const handleEdit = (etudiant: Etudiant) => {
    setSelectedEtudiant(etudiant);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleView = (etudiant: Etudiant) => {
    setSelectedEtudiant(etudiant);
    setShowDetails(true);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setSelectedEtudiant(undefined);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedEtudiant(undefined);
  };

  const handleDetailsClose = () => {
    setShowDetails(false);
    setSelectedEtudiant(undefined);
  };

  return (
    <div className="p-6">
      <EtudiantList
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
        refresh={refreshTrigger}
      />

      {showForm && (
        <EtudiantForm
          etudiant={selectedEtudiant}
          isEdit={isEdit}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      {showDetails && selectedEtudiant && (
        <EtudiantDetails
          etudiant={selectedEtudiant}
          onClose={handleDetailsClose}
        />
      )}
    </div>
  );
};

export default EtudiantManagement;