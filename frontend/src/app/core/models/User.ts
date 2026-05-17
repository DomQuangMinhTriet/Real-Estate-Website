export interface User {
  id: string;
  email?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  role: 'admin' | 'agent' | 'member';
  phone?: string;
}

export interface Session {
  access_token: string;
  user: User;
}