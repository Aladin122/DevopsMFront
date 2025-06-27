import React from 'react';
import { X, User, Hash, Tag } from 'lucide-react';
import { Etudiant } from '../services/etudiantService';

interface EtudiantDetailsProps {
  etudiant: Etudiant;
  onClose: () => void;
}

const EtudiantDetails: React.FC<EtudiantDetailsProps> = ({ etudiant, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6 shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Student Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <Hash className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Student ID</p>
              <p className="text-white font-medium">{etudiant.idEtudiant}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <User className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">First Name</p>
              <p className="text-white font-medium">{etudiant.prenomE}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <User className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-sm text-gray-400">Last Name</p>
              <p className="text-white font-medium">{etudiant.nomE}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <Tag className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">Option</p>
              <p className="text-white font-medium">{etudiant.op || 'Not specified'}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EtudiantDetails