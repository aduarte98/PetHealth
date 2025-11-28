
import { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import TutorForm from '../components/tutor/TutorForm';
import eventEmitter from '@/components/utils/events'; // Corrected path
import { AlertMessage } from '@/components/ui/alert-message';
import { SideNotification } from '@/components/ui/side-notification';

export default function MeuPerfil() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [sideNotification, setSideNotification] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Erro ao buscar dados do tutor:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdateUser = async (userData) => {
    setIsSubmitting(true);
    setSuccessMessage('');
    try {
      const { full_name, foto_url, telefone, endereco } = userData;
      
      const updatedUser = await User.updateMyUserData({
        full_name,
        data: {
          foto_url,
          telefone,
          endereco
        },
      });

      setUser(updatedUser);
      eventEmitter.publish('userUpdated', updatedUser);
      setSuccessMessage('Perfil atualizado com sucesso!');
      setSideNotification({ type: 'success', message: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!sideNotification) return;
    const timeout = setTimeout(() => setSideNotification(null), 4000);
    return () => clearTimeout(timeout);
  }, [sideNotification]);

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-12 w-1/3 mb-8" />
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center"><Skeleton className="h-32 w-32 rounded-full" /></div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-8"
        >
          Meu Perfil
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Informações do Tutor</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <TutorForm
                user={user}
                onSubmit={handleUpdateUser}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>
          
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <AlertMessage
                variant="success"
                message={successMessage}
                onClose={() => setSuccessMessage('')}
              />
            </motion.div>
          )}

        </motion.div>
      </div>

      <SideNotification
        open={!!sideNotification}
        variant={sideNotification?.type}
        title={sideNotification?.type === 'success' ? 'Tudo certo!' : undefined}
        message={sideNotification?.message}
        onClose={() => setSideNotification(null)}
      />
    </div>
  );
}
