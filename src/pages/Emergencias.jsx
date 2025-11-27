import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, HeartPulse, Loader2, Map } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Emergencias() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFindHospitals = () => {
    setIsLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // O zoom level 13z no Google Maps corresponde a um raio de aproximadamente 5-10km,
        // o que é ideal para esta busca.
        const googleMapsUrl = `https://www.google.com/maps/search/hospital+veterinario+24h/@${latitude},${longitude},13z`;
        
        window.open(googleMapsUrl, '_blank');
        setIsLoading(false);
      },
      () => {
        setError('Não foi possível obter sua localização. Por favor, habilite a permissão no seu navegador.');
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <HeartPulse className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Emergências</h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Em caso de emergência, encontre rapidamente um hospital veterinário 24h próximo a você.
          </p>
        </motion.div>

        <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0 text-center p-8">
          <CardContent className="p-0">
            {!isLoading && (
              <>
                <p className="text-gray-700 mb-6">
                  Clique no botão para abrir o Google Maps e encontrar ajuda imediatamente.
                </p>
                <Button
                  onClick={handleFindHospitals}
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Map className="w-5 h-5 mr-2" />
                  Buscar Hospitais 24h no Mapa
                </Button>
              </>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center text-gray-600">
                <Loader2 className="w-12 h-12 animate-spin text-red-500 mb-4" />
                <p className="font-semibold">Obtendo sua localização...</p>
              </div>
            )}

            {error && (
              <div className="text-red-600 bg-red-100 p-4 rounded-lg flex items-center justify-center gap-3">
                <AlertTriangle className="w-6 h-6" />
                <span>{error}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}