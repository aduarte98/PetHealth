import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

console.log("🔧 Finalizando configuração...");

// 1. CRIAR O EVENTS.JS (Essencial para o Layout não travar)
const utilsComponentPath = path.join(__dirname, 'src/components/utils');
ensureDir(utilsComponentPath);
const eventsContent = `
const eventEmitter = {
  events: {},
  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  },
  unsubscribe(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  },
  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
};
export default eventEmitter;
`;
fs.writeFileSync(path.join(utilsComponentPath, 'events.js'), eventsContent.trim());
console.log("✅ Events System criado.");

// 2. CRIAR USER.JS SEGURO (Para não dar tela branca se não tiver banco)
const entitiesPath = path.join(__dirname, 'src/entities');
ensureDir(entitiesPath);
const userContent = `
import { supabase } from "@/lib/supabase";

export const User = {
  me: async () => {
    try {
      // Tenta pegar usuario real
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        return {
          id: data.user.id,
          full_name: data.user.user_metadata?.full_name || "Tutor PetPal",
          email: data.user.email,
          foto_url: data.user.user_metadata?.avatar_url
        };
      }
    } catch (e) {
      console.warn("Modo offline ou erro Supabase");
    }
    // Retorna usuário fictício para a tela abrir
    return {
      id: "guest",
      full_name: "Tutor Visitante",
      email: "teste@petpal.com",
      foto_url: null
    };
  },
  logout: async () => {
    await supabase.auth.signOut();
    window.location.reload();
  }
};
`;
fs.writeFileSync(path.join(entitiesPath, 'User.js'), userContent.trim());
console.log("✅ Entity User criada.");

// 3. CRIAR UTILS GERAIS (Caso falte)
const utilsPath = path.join(__dirname, 'src/utils');
ensureDir(utilsPath);
fs.writeFileSync(path.join(utilsPath, 'index.js'), `export const createPageUrl = (page) => '/' + page.toLowerCase();`);
console.log("✅ Utils criados.");

console.log("\n🎉 PRONTO! Pode rodar 'npm run dev' agora.");