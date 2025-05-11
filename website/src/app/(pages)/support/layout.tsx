import BareLayout from "../base-layout";

const SupportPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <BareLayout>{children}</BareLayout>
    </>
  );
};

export default SupportPageLayout;
