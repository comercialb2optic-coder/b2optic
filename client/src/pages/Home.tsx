import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ClientsCarousel from '@/components/ClientsCarousel';
import DiagnosticPreview from '@/components/DiagnosticPreview';
import Cases from '@/components/Cases';
import ToolsOrbit from '@/components/ToolsOrbit';
import Methodology from '@/components/Methodology';
import PerformancePanel from '@/components/PerformancePanel';
import Onboarding from '@/components/Onboarding';
import CtaBanner from '@/components/CtaBanner';
import Numbers from '@/components/Numbers';
import Qualification from '@/components/Qualification';
import About from '@/components/About';
import DiagnosticForm from '@/components/DiagnosticForm';
import Footer from '@/components/Footer';
import { CTA, CTA_BANNER } from '@/content';

/**
 * Ordem das seções e alternância de fundo.
 *
 * A narrativa vai de prova → oferta → estrutura → prova de execução →
 * conversão. Os dois blocos ESCUROS (ToolsOrbit e PerformancePanel) são os
 * respiros visuais e caem em pontos afastados um do outro de propósito.
 *
 * Nenhuma seção encosta em outra do mesmo fundo:
 *   branco → surface → branco → surface → ESCURO → branco → ESCURO →
 *   branco → surface → branco → surface → branco → surface → branco
 */
export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <ClientsCarousel />
        <DiagnosticPreview />
        <Cases />
        <ToolsOrbit />
        <Methodology />
        <PerformancePanel />
        <Onboarding />
        <CtaBanner
          variant="card"
          titulo={CTA_BANNER.title}
          subtitulo={CTA_BANNER.subtitle}
          textoBotao={CTA.primary}
        />
        <Numbers />
        <Qualification />
        <About />
        <DiagnosticForm />
      </main>
      <Footer />
    </div>
  );
}
