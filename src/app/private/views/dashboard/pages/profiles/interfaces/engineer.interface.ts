export interface Engineer {
  id: string;
  first_name: string;
  last_name: string;
  identity_document: string;
  email: string;
  job_title: string;
  user: User | null;
}

interface User {
  id: string;
  username: string;
  isActive: boolean;
  rol: Rol;
}

interface Rol {
  id: string;
  name: string;
}
