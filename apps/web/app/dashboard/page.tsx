'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  emailVerified: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Unauthorized');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Indemnisation Vols</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bonjour, {user.firstName} {user.lastName}!
            </h2>
            <p className="text-gray-600 mb-6">
              Bienvenue sur votre tableau de bord personnel
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">Informations du compte</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Email:</span> {user.email}</p>
                  <p><span className="text-gray-500">Téléphone:</span> {user.phone || 'Non renseigné'}</p>
                  <p>
                    <span className="text-gray-500">Statut:</span>{' '}
                    {user.emailVerified ? (
                      <span className="text-green-600 font-semibold">Vérifié</span>
                    ) : (
                      <span className="text-orange-600 font-semibold">Non vérifié</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">Réclamations</h3>
                <p className="text-gray-500 text-sm">Aucune réclamation pour le moment</p>
                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                  Créer une réclamation
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Prochaines étapes
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">📝</span>
                <span>Vérifiez votre adresse email pour activer votre compte</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✈️</span>
                <span>Déposez votre première réclamation pour un vol perturbé</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">💰</span>
                <span>Recevez jusqu'à 600€ d'indemnisation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
