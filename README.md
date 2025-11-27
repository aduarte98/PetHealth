PET HEALTH
Sistema completo de gestão de saúde veterinária com geolocalização, relatórios e acompanhamento clínico.

🌟 Funcionalidades
Autenticação: Login e Cadastro de tutores (Supabase Auth).

Gestão de Pets: Cadastro com foto, edição e histórico.

Saúde: Gráfico de evolução de peso e linha do tempo de eventos.

Agenda: Calendário interativo para vacinas e consultas.

Relatórios: Geração de PDF profissional com histórico do pet.

Geolocalização: Mapa interativo com veterinários reais (Olinda/PE).

Documentos: Upload de exames e receitas.

⚡ Instalação Rápida
1. Instalar Dependências
Bash

npm install
2. Configurar Banco de Dados (Supabase)
Vá no SQL Editor do Supabase e rode este script completo para criar todas as tabelas:

SQL

-- 1. Tabela de Pets
create table if not exists pets (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nome text not null,
  tipo_animal text not null,
  raca text,
  idade numeric,
  peso numeric,
  sexo text,
  cor text,
  foto_url text,
  observacoes text,
  alergias text, -- Novo campo
  data_nascimento date,
  castrado boolean default false,
  microchip text
);

-- 2. Tabela de Histórico de Peso (Para o Gráfico)
create table if not exists pesos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  pet_id uuid references pets(id) not null,
  peso numeric not null,
  data_pesagem date default current_date
);

-- 3. Tabela de Eventos Médicos (Agenda/Histórico)
create table if not exists eventos_medicos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  pet_id uuid references pets(id) not null,
  tipo text not null,
  titulo text not null,
  descricao text,
  data text,
  hora text,
  veterinario text,
  clinica text,
  status text default 'agendado',
  preco numeric,
  lembrete boolean default true
);

-- 4. Tabela de Medicamentos
create table if not exists medicamentos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  pet_id uuid references pets(id) not null,
  nome_medicamento text not null,
  dosagem text,
  horarios text,
  data_inicio date,
  duracao_dias numeric,
  instrucoes text,
  status text default 'ativo'
);

-- 5. Configurar Bucket de Fotos (Storage)
insert into storage.buckets (id, name, public) values ('pet-photos', 'pet-photos', true);
3. Configurar Armazenamento (Manual)
Caso o script acima não crie o bucket automaticamente:

Vá em Storage no menu do Supabase.

Crie um bucket chamado pet-photos.

Marque a opção Public Bucket.

4. Configurar Variáveis de Ambiente
Crie (ou edite) o arquivo .env na raiz do projeto:



VITE_SUPABASE_URL=Sua_URL_Do_Supabase
VITE_SUPABASE_ANON_KEY=Sua_Chave_Anonima_Publica
5. Rodar o Projeto


npm run dev