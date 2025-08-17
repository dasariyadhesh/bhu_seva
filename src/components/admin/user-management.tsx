
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/auth-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { User, UserRole } from "@/lib/users";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

export function UserManagement() {
  const { users, user: currentUser, updateUserRole } = useAuth();
  const { toast } = useToast();

  const handleRoleChange = (email: string, newRole: UserRole) => {
    if (currentUser?.role !== 'admin') {
      toast({
        title: "Permission Denied",
        description: "You do not have permission to change user roles.",
        variant: "destructive",
      });
      return;
    }
    updateUserRole(email, newRole);
    toast({
      title: "Role Updated",
      description: `Role for ${email} has been updated to ${newRole}.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage user roles and permissions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead className="w-[200px]">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={user.role}
                    onValueChange={(value) =>
                      handleRoleChange(user.email, value as UserRole)
                    }
                    disabled={user.email === currentUser?.email || currentUser?.role !== 'admin'}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end">
            <Button disabled>Add New User</Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
            In a complete application, you would invite and manage users directly in the Firebase Authentication console. New users who sign up via Google are automatically added here with the 'viewer' role.
        </p>
      </CardContent>
    </Card>
  );
}
