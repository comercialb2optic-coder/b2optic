import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ClientsCarousel from '@/components/ClientsCarousel';
import DiagnosticPreview from '@/components/DiagnosticPreview';
import Numbers from '@/components/Numbers';
import Methodology from '@/components/Methodology';
import Cases from '@/components/Cases';
import Ecosystem from '@/components/Ecosystem';
import Certifications from '@/components/Certifications';
import Guarantee from '@/components/Guarantee';
import CtaBanner from '@/components/CtaBanner';
import HowItWorks from '@/components/HowItWorks';
import DiagnosticForm from '@/components/DiagnosticForm';
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
          titulo="Convencido? Sua ótica é a próxima."
          subtitulo="Preenche em 1 minuto e nossa equipe entra em contato em até 12h."
          textoBotao="Quero meu diagnóstico gratuito"
        />
        <Numbers />
        <Methodology />
        <Ecosystem />
        <Certifications />
        <Guarantee />
        <CtaBanner
          variant="accent"
          titulo="Mais de 200 óticas já confiam na B2Optic."
          subtitulo="Risco zero, resultado em contrato. Falta a sua."
          textoBotao="Quero ser a próxima"
        />
        <HowItWorks />
        <About />
        <CtaBanner
          variant="card"
          titulo="Pronto pra fazer sua ótica vender mais óculos?"
          subtitulo="Diagnóstico gratuito. Risco zero. Resultado em contrato."
          textoBotao="Solicitar diagnóstico"
        />
        <Footer />
      </div>
    </div>
  );
}
