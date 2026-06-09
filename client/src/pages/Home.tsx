import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ClientsCarousel from '@/components/ClientsCarousel';
import DiagnosticPreview from '@/components/DiagnosticPreview';
import Numbers from '@/components/Numbers';
import Methodology from '@/components/Methodology';
import Cases from '@/components/Cases';
import CtaBanner from '@/components/CtaBanner';
import DiagnosticForm from '@/components/DiagnosticForm';
import Qualification from '@/components/Qualification';
import About from '@/components/About';
import Footer from '@/components/Footer';
import OpticalBackdrop from '@/components/OpticalBackdrop';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <OpticalBackdrop />
      <div className="relative z-10">
        <Header />
        <Hero />
        <ClientsCarousel />
        <DiagnosticPreview />
        <DiagnosticForm />
        <Cases />
        <CtaBanner
          variant="subtle"
          titulo="A sua ótica pode ser a próxima"
          subtitulo="Preenche em 1 minuto e nossa equipe entra em contato em até 12h."
          textoBotao="Quero meu diagnóstico gratuito"
          gradientTitulo
        />
        <Methodology />
        <Numbers />
        <Qualification />
        <About />
        <CtaBanner
          variant="card"
          titulo="Pronto pra fazer sua ótica vender mais óculos?"
          textoBotao="Solicitar diagnóstico"
          gradientTitulo
        />
        <Footer />
      </div>
    </div>
  );
}
