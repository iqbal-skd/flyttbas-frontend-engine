import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
}

export const DashboardLayout = ({ title, children }: DashboardLayoutProps) => {
  return (
    <>
      <Helmet>
        <title>{title} | Flyttbas</title>
      </Helmet>
      <Header />
      <main className="min-h-screen bg-secondary/30 py-8">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
};
