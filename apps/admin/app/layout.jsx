import "./globals.css";

export const metadata = {
  title: "DuoTech Admin",
  description: "Painel administrativo da plataforma gamificada de ensino"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

