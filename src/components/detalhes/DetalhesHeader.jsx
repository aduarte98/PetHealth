import { Dog, Cat, Bird, PawPrint } from "lucide-react";

const tipoIcons = {
  cachorro: <Dog className="w-6 h-6" />,
  gato: <Cat className="w-6 h-6" />,
  ave: <Bird className="w-6 h-6" />,
  default: <PawPrint className="w-6 h-6" />
};

export default function DetalhesHeader({ pet }) {
  const Icon = tipoIcons[pet.tipo_animal] || tipoIcons.default;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <div className="flex items-start gap-6">
        {/* Imagem do Pet */}
        <div className="relative">
          <img 
            src={pet.foto_url || `https://via.placeholder.com/150/E0F2F1/1E88E5?text=${pet.nome[0]}`}
            alt={pet.nome}
            className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-white shadow-xl"
          />
          <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
            {Icon}
          </div>
        </div>

        {/* Informações */}
        <div className="pt-4 flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{pet.nome}</h1>
          <p className="text-lg text-gray-600 mt-1">
            {pet.raca || pet.tipo_animal}
          </p>
          {pet.sexo && (
            <span className="text-sm mt-2 inline-block px-3 py-1 bg-gray-100 rounded-full text-gray-700">
              {pet.sexo}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}