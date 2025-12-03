import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import AuthCallback from "@/pages/AuthCallback";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Páginas
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AdicionarPet from "@/pages/AdicionarPet";
import EditarPet from "@/pages/EditarPet";
import PetDetalhes from "@/pages/PetDetalhes";
import Calendario from "@/pages/Calendario";
import GestaoDeMedicamentos from "@/pages/GestaoDeMedicamentos";
import Emergencias from "@/pages/Emergencias";
import MeuPerfil from "@/pages/MeuPerfil";
import Relatorios from "@/pages/Relatorios";
import Veterinarios from "@/pages/Veterinarios";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública (Login) */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Rotas Protegidas (Só acessa com senha) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {" "}
            {/* O Layout agora fica aqui dentro */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/adicionarpet" element={<AdicionarPet />} />
            <Route path="/editar-pet/:id" element={<EditarPet />} />
            <Route path="/pet/:id" element={<PetDetalhes />} />
            <Route path="/calendario" element={<Calendario />} />
            <Route
              path="/gestaodemedicamentos"
              element={<GestaoDeMedicamentos />}
            />
            <Route path="/emergencias" element={<Emergencias />} />
            <Route path="/meuperfil" element={<MeuPerfil />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/veterinarios" element={<Veterinarios />} />
          </Route>
        </Route>

        {/* Qualquer outra rota joga pro login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
