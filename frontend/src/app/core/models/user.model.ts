export interface User {
  id: string;
  email: string;
  role: 'admin' | 'agent' | 'member';
  full_name?: string;
  avatar_url?: string;
  phone?: string;
}