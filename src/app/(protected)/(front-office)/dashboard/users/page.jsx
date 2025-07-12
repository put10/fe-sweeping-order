import ContentLayout from "@/components/template/content/(front-office)/content-layout";
import { UserTable } from "@/components/(front-office)/user/user-table";

export default function UsersPage() {
  return (
    <ContentLayout>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Users</h2>
        <p className="text-muted-foreground text-sm">
          Manage all user records, including their roles and permissions.
        </p>
      </div>
      <UserTable />
    </ContentLayout>
  );
}
