import ContainerLayout from "@/components/template/content/(front-office)/container-layout";
import HeaderLayout from "@/components/template/content/(front-office)/header-layout";
import DashboardContent from "@/components/(front-office)/dashboard/dashboard-content";

export default function DashboardPage() {
  return (
    <ContainerLayout>
      <HeaderLayout />
      <DashboardContent />
    </ContainerLayout>
  );
}
