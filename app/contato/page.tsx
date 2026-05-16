import { Camera, MapPin, MessageCircle } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Motion";
import { contactName, mapUrl, trackAddress, whatsappDisplay, whatsappNumber } from "@/data/site";

export const metadata = {
  title: "Contato | P1 Academy",
};

export default function ContatoPage() {
  return (
    <>
      <PageHero
        title="Contato"
        text="Agende aulas, baterias, campeonatos, eventos ou conversas de patrocínio com uma mensagem organizada para a equipe."
        image="/images/academy-coaching.png"
      />
      <section className="section">
        <div className="container grid-2">
          <Reveal className="grid-1">
            <div className="card">
              <MessageCircle size={26} color="var(--cyan)" />
              <h3>WhatsApp</h3>
              <p>
                {contactName}:{" "}
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
                  {whatsappDisplay}
                </a>
              </p>
            </div>
            <div className="card">
              <Camera size={26} color="var(--cyan)" />
              <h3>Instagram</h3>
              <p>@p1__academy para bastidores, agenda e conteúdo da comunidade.</p>
            </div>
            <div className="card">
              <MapPin size={26} color="var(--cyan)" />
              <h3>Localização</h3>
              <p>{trackAddress}</p>
              <a className="btn secondary contact-button" href={mapUrl} target="_blank" rel="noreferrer">
                Abrir no Google Maps
              </a>
            </div>
          </Reveal>
          <BookingForm />
        </div>
      </section>
    </>
  );
}
