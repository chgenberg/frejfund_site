import Image from 'next/image';
import IdeaMashSlot from '../components/IdeaMashSlot';
import CapitalChanceCalculator from '../components/CapitalChanceCalculator';

export default function About() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-2 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#16475b] tracking-widest text-center mb-10 mt-2 uppercase">OM OSS</h1>
      {/* Kapitaljämförelse + kalkylator högst upp */}
      <CapitalChanceCalculator />
      {/* Bakgrundsbild */}
      <Image
        src="/omoss.png"
        alt="Om oss bakgrund"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="flex flex-col gap-20 w-full max-w-4xl items-center">
        {/* Moln 1 - Moved up */}
        <div className="bg-white/90 rounded-[3rem] shadow-2xl border border-gray-200 px-8 py-8 max-w-2xl w-full text-center backdrop-blur-md mt-12">
          <p className="text-lg text-gray-800 font-medium">
            <span className="text-2xl font-extrabold text-[#01121f] block mb-2">Varför finns FrejFund?</span>
            För att idéer som får hjärtat att rusa inte ska fastna i byråkratiskt kärr. Vi brinner för den där rastlösa lusten som väcker entreprenörer mitt i natten – oavsett om det är första gången de vågar kalla sig företagare eller om de redan hunnit resa bolag och kraschlanda några gånger. I varje sådan hjärna pulserar samma urkraft: viljan att bygga något som ännu saknas i världen. Den kraften vill vi skydda och förstärka, inte se den tyna bort i Excel-ångest eller investerarjargong.
          </p>
        </div>
        {/* Moln 2 */}
        <div className="bg-white/80 rounded-[2.5rem] shadow-xl border border-gray-100 px-8 py-8 max-w-2xl w-full text-center backdrop-blur-sm mt-[-2rem] ml-auto">
          <p className="text-lg text-gray-800 font-medium">
            <span className="text-xl font-bold text-[#16475b] block mb-2">Så hur gör vi det?</span>
            Vi möter dig där gnistan finns och låter tekniken göra grovjobbet. Vår AI-drivna analysplatta skannar din affärsidé som en röntgen, avslöjar luckor och visar exakt var rustningen behöver förstärkas innan du ställer dig på scen. Vi översätter visionen till investerarlogik, men behåller hjärtats språk intakt. Runt plattformen har vi byggt en stam: mentorer, seriegrundare och nykläckta innovatörer som delar insikter, misstag och segrar vid samma digitala lägereld. Du kliver aldrig ensam ut ur skogen – det finns alltid någon som går bredvid och håller kartan.
          </p>
        </div>
        {/* Moln 3 */}
        <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-gray-100 px-8 py-8 max-w-2xl w-full text-center backdrop-blur-sm mt-[-2rem] mr-auto">
          <p className="text-lg text-gray-800 font-medium">
            <span className="text-xl font-bold text-[#16475b] block mb-2">Och vad är det du faktiskt får?</span>
            En interaktiv genomlysning som mynnar ut i en personlig rapport, en handlingsplan och ett scoringsystem investerare förstår direkt. Du får verktygslådor fyllda med mallar, avtal och KPI-dashboards som sparar veckor av gissningar. Du får varma introduktioner till änglar, ALMI och riskkapital när planen sitter, och du får oss vid din sida hela vägen – från första brainstorm till sista finansieringsrunda. Kort sagt: vi ser till att din idé får den rustning, det sällskap och den fart den förtjänar, så att du kan fortsätta göra det entreprenörer gör bäst – skapa framtid.
          </p>
        </div>
        {/* Team Stories Section */}
        <div className="flex flex-col gap-8 w-full max-w-3xl">
          {/* Jakob's Story */}
          <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-gray-100 px-8 py-8 backdrop-blur-sm">
            <h2 className="text-2xl font-extrabold text-[#16475b] mb-4">OM JAKOB – från river card till rader kod</h2>
            <p className="text-gray-800 leading-relaxed">
              Det började vid pokerborden i Macau och Vegas: Jakob läste odds snabbare än motspelarna hann blinka. Men efter tusentals händer och en bokstavlig miljon beräknade kombinationer blev han kär i själva algoritmen bakom spelet – inte i markerhögarna.
            </p>
            <p className="text-gray-800 leading-relaxed mt-4">
              I dag sitter han därför i sin "bod" på Mallorca (ett garage-meets-serverrum med AC och flamingotapet), hackar Python sent in på nätterna och bygger AI-motorer som höjer företagsvärden snabbare än en "all-in" på pocket Ess. När han inte kodar driver han ett kontorsshotell i Stockholm och jonglerar familjeliv med fru och två barn som hellre badar än debuggar.
            </p>
            <p className="text-gray-800 leading-relaxed mt-4">
              Jakob är vår risk-kalkylator och mjukvarusmed – han svarar snabbare på pull requests än på WhatsApp, men löser båda innan kaffet kallnat.
            </p>
          </div>

          {/* Christopher's Story */}
          <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-gray-100 px-8 py-8 backdrop-blur-sm">
            <h2 className="text-2xl font-extrabold text-[#16475b] mb-4">OM CHRISTOPHER – krämer, KPI:er & kod</h2>
            <p className="text-gray-800 leading-relaxed">
              Christopher började sin bana i ett laboratorium fullt av doftämnen och pH-stickor. På tretton år hann han grunda tre hudvårdsmärken, sälja till både salonger och livsstilsshoppare – och lära sig den hårda vägen hur kassaflöden kan svida mer än syrakemisk peeling.
            </p>
            <p className="text-gray-800 leading-relaxed mt-4">
              Nu har han bytt pipetter mot prompt-ingenjörskap. Han älskar hur AI kan massera fram smartare beslut och jämna ut start-up-smärtan för fler grundare. Passionen? Göra komplicerad finans-jargong lika klar och återfuktande som en bra serumformula.
            </p>
            <p className="text-gray-800 leading-relaxed mt-4">
              Han bor numera, liksom Jakob, på soliga Mallorca med fru, två barn och en osund mängd prototyp-slides i Google Drive. Hos oss är Christopher historiens berättare, marknadsstrategen och den som alltid frågar: &quot;Hur känns det för användaren?&quot; – oavsett om det gäller hudkräm eller AI-dashboard.
            </p>
          </div>

          {/* Team Conclusion */}
          <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-gray-100 px-8 py-8 backdrop-blur-sm text-center">
            <p className="text-gray-800 leading-relaxed">
              Tillsammans driver de FrejFund som ett väloljat pokermaskineri med silkeslen finish – där odds, algoritmer och omtanke möts för att göra entreprenörskap lite enklare, mycket roligare och betydligt mer investerbart.
            </p>
          </div>
        </div>

        {/* Slot machine at the bottom */}
        <div className="mt-16 w-full flex justify-center">
          <IdeaMashSlot />
        </div>
      </div>
    </div>
  );
} 