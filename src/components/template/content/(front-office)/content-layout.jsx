import HeaderLayout from "@/components/template/content/(front-office)/header-layout";
import ContainerLayout from "@/components/template/content/(front-office)/container-layout";

export default function ContentLayout({ children }) {
  return (
    <>
      <ContainerLayout>
        <HeaderLayout />
        <div className="px-4">{children}</div>
      </ContainerLayout>
    </>
  );
}
