import ProtectedLayout from "@/components/auth/protected-layout";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout allowedRoles={["CUSTOMER", "ADMIN"]}>
      {children}
    </ProtectedLayout>
  );
}
