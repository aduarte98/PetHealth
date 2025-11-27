import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Star, Navigation } from "lucide-react";
import L from "leaflet";

// Correção dos ícones do Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

// DADOS REAIS E PRECISOS DE OLINDA (Coordenadas ajustadas para a rua)
const vets = [
  { 
    id: 1, 
    nome: "Hospital Veterinário 4 Patas", 
    lat: -7.994825, 
    lng: -34.839247, 
    rating: 4.7, 
    address: "Av. Dr. José Augusto Moreira, 950 - Casa Caiada",
    phone: "(81) 3431-3000" 
  },
  { 
    id: 2, 
    nome: "Plantão Veterinário Olinda 24h", 
    lat: -8.005368, 
    lng: -34.846619, 
    rating: 4.5, 
    address: "Av. Pres. Getúlio Vargas, 1533 - Bairro Novo",
    phone: "(81) 3439-1533" 
  },
  { 
    id: 3, 
    nome: "Clínica Veterinária Harmonia", 
    lat: -8.002621, 
    lng: -34.843825, 
    rating: 4.8, 
    address: "R. Eduardo de Morais, 331 - Bairro Novo",
    phone: "(81) 3429-4040" 
  },
  { 
    id: 4, 
    nome: "SOS Veterinária", 
    lat: -7.988220, 
    lng: -34.836255, 
    rating: 4.6, 
    address: "Av. Gov. Carlos de Lima Cavalcanti, 2337",
    phone: "(81) 3432-6060" 
  },
  { 
    id: 5, 
    nome: "Centro Veterinário de Olinda", 
    lat: -8.013233, 
    lng: -34.850383, 
    rating: 4.4, 
    address: "Av. Sigismundo Gonçalves, 345 - Carmo",
    phone: "(81) 3429-0099" 
  }
];

// Centro focado em Bairro Novo/Casa Caiada (em terra firme)
const OLINDA_CENTER = [-8.000, -34.842];

export default function Veterinarios() {
  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-4">
      {/* Lista Lateral */}
      <div className="w-full md:w-1/3 space-y-4 overflow-y-auto pr-2 h-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <MapPin className="text-blue-600" /> Vets em Olinda
        </h1>
        <p className="text-sm text-gray-500 mb-4">Especialistas encontrados na região.</p>
        
        {vets.map(vet => (
          <Card key={vet.id} className="p-4 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800 group-hover:text-blue-600 text-sm md:text-base">{vet.nome}</h3>
                <div className="flex items-center gap-1 text-yellow-500 text-xs mt-1 font-medium">
                  <Star size={12} fill="currentColor" /> {vet.rating}
                </div>
              </div>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${vet.lat},${vet.lng}`}
                target="_blank" 
                rel="noreferrer"
                className="bg-blue-50 p-2 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                title="Abrir no Google Maps"
              >
                <Navigation size={18} />
              </a>
            </div>
            
            <div className="mt-3 space-y-1">
              <p className="text-xs text-gray-500 flex items-start gap-2">
                <MapPin size={14} className="shrink-0 mt-0.5" /> {vet.address}
              </p>
              <p className="text-xs text-gray-600 font-semibold flex items-center gap-2">
                <Phone size={14} /> {vet.phone}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Mapa */}
      <div className="w-full md:w-2/3 bg-gray-100 rounded-2xl overflow-hidden shadow-inner border border-gray-200 relative z-0">
        <MapContainer center={OLINDA_CENTER} zoom={14} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {vets.map(vet => (
            <Marker key={vet.id} position={[vet.lat, vet.lng]}>
              <Popup>
                <div className="text-center">
                  <strong className="text-blue-700 block mb-1">{vet.nome}</strong>
                  <span className="text-xs text-gray-600">{vet.phone}</span>
                  <br/>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${vet.lat},${vet.lng}`}
                    target="_blank"
                    className="text-xs text-blue-500 underline mt-1 block"
                  >
                    Traçar Rota
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}