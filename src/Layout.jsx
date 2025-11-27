import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { User as UserEntity } from "@/entities/User";
import eventEmitter from "@/components/utils/events";
import { 
  Home, Plus, PawPrint, CalendarDays, LogOut, Menu, X, 
  Settings, HeartPulse, Pill, Bell, Stethoscope, FileText
} from "lucide-react";
import { supabase } from "@/lib/supabase";

function NavLink({ to, icon: Icon, children, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 mb-1 ${isActive ? 'bg-blue-50 text-blue-700 font-medium shadow-sm border border-blue-100' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
      <span>{children}</span>
    </Link>
  );
}

export default function Layout() { 
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const location = useLocation();

  useEffect(() => { setIsMobileMenuOpen(false); }, [location]);

  useEffect(() => {
    fetchUser();
    // Simulação de busca de notificações
    setNotifications([
      { id: 1, title: "Vacina de Raiva", msg: "Vence em 5 dias (Rex)", time: "Hoje" },
      { id: 2, title: "Consulta Agendada", msg: "Dr. Silva - 14:00", time: "Ontem" }
    ]);
  }, []);

  const fetchUser = async () => {
    const fetchedUser = await UserEntity.me();
    setUser(fetchedUser);
  };

  const handleLogout = async () => await UserEntity.logout();
const navItems = [
  { name: "Dashboard", label: "Meus Pets", icon: Home, url: "/dashboard" },
  { name: "AdicionarPet", label: "Adicionar Pet", icon: Plus, url: "/adicionarpet" },
  { name: "Calendario", label: "Agenda", icon: CalendarDays, url: "/calendario" },
  { name: "Medicamentos", label: "Saúde", icon: HeartPulse, url: "/gestaodemedicamentos" },

  { name: "Veterinarios", label: "Vets Perto", icon: Stethoscope, url: "/veterinarios" },
  { name: "Relatorios", label: "Relatórios PDF", icon: FileText, url: "/relatorios" },
  
  { name: "MeuPerfil", label: "Meu Perfil", icon: Settings, url: "/meuperfil" },
];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-6 border-b border-gray-100 bg-white">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
          <PawPrint className="w-6 h-6 text-white" />
        </div>
        <div>
          {/* MUDANÇA DE NOME AQUI */}
          <h2 className="font-bold text-gray-800 text-lg leading-tight">PET HEALTH</h2>
          <p className="text-xs text-gray-500">Gestão Inteligente</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 bg-white">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-2 mb-2">Menu Principal</h3>
        {navItems.map((item) => (
          <NavLink key={item.url} to={item.url} icon={item.icon}>{item.label}</NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        {user ? (
          <div className="flex items-center gap-3">
            <img src={user.foto_url || `https://ui-avatars.com/api/?name=${user.full_name}&background=random`} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user.full_name}</p>
              <p className="text-xs text-gray-500 truncate cursor-pointer hover:text-blue-600">Editar Perfil</p>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-red-500"><LogOut size={18} /></button>
          </div>
        ) : <div className="animate-pulse h-10 bg-gray-200 rounded-lg w-full"></div>}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-white h-full fixed left-0 top-0 bottom-0 z-30">
        <SidebarContent />
      </aside>

      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><PawPrint className="w-5 h-5 text-white" /></div>
          <span className="font-bold text-gray-800">PET HEALTH</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowNotif(!showNotif)} className="p-2 relative text-gray-600">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Menu className="w-6 h-6" /></button>
        </div>
      </header>

      {/* Área de Notificações (Desktop - Flutuante) */}
      <div className="hidden md:block absolute top-6 right-8 z-50">
        <button onClick={() => setShowNotif(!showNotif)} className="p-2 bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-blue-600 relative transition-transform hover:scale-105">
          <Bell size={20} />
          {notifications.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>}
        </button>
        {showNotif && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
            <h4 className="px-4 py-2 font-bold text-gray-700 border-b border-gray-50 text-sm">Notificações</h4>
            {notifications.map(n => (
              <div key={n.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer">
                <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                <p className="text-xs text-gray-500">{n.msg}</p>
                <p className="text-[10px] text-blue-400 mt-1 text-right">{n.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-[80%] max-w-xs bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="absolute top-2 right-2"><button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400"><X size={24} /></button></div>
            <SidebarContent />
          </div>
        </div>
      )}

      <main className="flex-1 md:ml-64 pt-16 md:pt-0 h-full overflow-y-auto scroll-smooth">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}