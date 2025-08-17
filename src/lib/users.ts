
export type UserRole = "admin" | "editor" | "viewer";

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

export const initialUsers: User[] = [
  { id: 1, email: "admin@trusttrack.org", role: "admin" },
  { id: 2, email: "editor@trusttrack.org", role: "editor" },
  { id: 3, email: "viewer@trusttrack.org", role: "viewer" },
];

export const userPasswords = {
  "admin@trusttrack.org": "adminpassword",
  "editor@trusttrack.org": "editorpassword",
  "viewer@trusttrack.org": "viewerpassword",
};
