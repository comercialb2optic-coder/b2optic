import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ClientsCarousel from '@/components/ClientsCarousel';
import Ecosystem from '@/components/Ecosystem';
import Certifications from '@/components/Certifications';
import Guarantee from '@/components/Guarantee';
import CtaBanner from '@/components/CtaBanner';
import DiagnosticForm from '@/components/DiagnosticForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <Hero />
      <ClientsCarousel />
      <Ecosystem />
      <CtaBanner
        variant="subtle"
        titulo="Pronto pra ter esse método rodando na sua ótica?"
        subtitulo="Triagem inteligente, atendimento que não dorme e CRM próprio — operando juntos pelo seu faturamento."
        textoBotao="Quero escalar minha ótica"
      />
      <Certifications />
      <CtaBanner
        variant="card"
        titulo="Seu marketing nas mãos de quem é certificado pelo Google e Meta."
        textoBotao="Solicitar diagnóstico gratuito"
      />
      <Guarantee />
      <CtaBanner
        variant="accent"
        titulo="Mais de 200 óticas já confiam na B2Optic."
        subtitulo="Risco zero, resultado em contrato. Falta a sua."
        textoBotao="Quero ser a próxima"
      />
      <DiagnosticForm />
      <Footer />
    </div>
  );
}
