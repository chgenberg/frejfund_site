import Image from 'next/image';
import IdeaMashSlot from '../components/IdeaMashSlot';

export default function About() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-2 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#16475b] tracking-widest text-center mb-10 mt-2 uppercase">ABOUT US</h1>
      {/* Idea slot machine at the top */}
      <div className="mb-10 w-full flex justify-center">
        <IdeaMashSlot />
      </div>
      {/* Background image */}
      <Image
        src="/omoss.png"
        alt="About us background"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="flex flex-col gap-20 w-full max-w-4xl items-center">
        {/* Cloud 1 - Moved up */}
        <div className="bg-white/90 rounded-[3rem] shadow-2xl border border-gray-200 px-8 py-8 max-w-2xl w-full text-center backdrop-blur-md mt-12">
          <p className="text-lg text-[#16475b]/80 max-w-2xl text-center">
            We are a team of entrepreneurs, investors and AI experts.
          </p>
        </div>
        {/* Cloud 2 */}
        <div className="bg-white/80 rounded-[2.5rem] shadow-xl border border-gray-100 px-8 py-8 max-w-2xl w-full text-center backdrop-blur-sm mt-[-2rem] ml-auto">
          <p className="text-lg text-gray-800 font-medium">
            <span className="text-xl font-bold text-[#16475b] block mb-2">So how do we do it?</span>
            We meet you where the spark exists and let technology do the heavy lifting. Our AI-driven analysis platform scans your business idea like an X-ray, reveals gaps and shows exactly where the armor needs strengthening before you step on stage. We translate vision into investor logic while keeping the heart's language intact. Around the platform, we've built a tribe: mentors, serial founders and emerging innovators who share insights, mistakes and victories around the same digital campfire. You never step out of the forest alone – there's always someone walking alongside holding the map.
          </p>
        </div>
        {/* Cloud 3 */}
        <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-gray-100 px-8 py-8 max-w-2xl w-full text-center backdrop-blur-sm mt-[-2rem] mr-auto">
          <p className="text-lg text-gray-800 font-medium">
            <span className="text-xl font-bold text-[#16475b] block mb-2">And what do you actually get?</span>
            An interactive analysis that culminates in a personal report, action plan and scoring system that investors understand immediately. You get toolboxes filled with templates, contracts and KPI dashboards that save weeks of guesswork. You get warm introductions to angels, government grants and venture capital when the plan is solid, and you get us by your side the whole way – from first brainstorm to final funding round. In short: we ensure your idea gets the armor, companionship and momentum it deserves, so you can continue doing what entrepreneurs do best – create the future.
          </p>
        </div>
        {/* Team Stories Section */}
        <div className="flex flex-col gap-8 w-full max-w-3xl">
          {/* Jakob's Story */}
          <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-gray-100 px-8 py-8 backdrop-blur-sm">
            <h2 className="text-2xl font-extrabold text-[#16475b] mb-4">ABOUT JAKOB – from river cards to lines of code</h2>
            <p className="text-gray-800 leading-relaxed">
              It started at poker tables in Macau and Vegas: Jakob read odds faster than opponents could blink. But after thousands of hands and a literal million calculated combinations, he fell in love with the algorithm behind the game – not the chip stacks.
            </p>
            <p className="text-gray-800 leading-relaxed mt-4">
              Today he sits in his "shed" in Mallorca (a garage-meets-server room with AC and flamingo wallpaper), hacking Python late into the night and building AI engines that increase company valuations faster than an "all-in" with pocket Aces. When he's not coding, he runs a co-working space in Stockholm and juggles family life with wife and two kids who prefer swimming to debugging.
            </p>
            <p className="text-gray-800 leading-relaxed mt-4">
              Jakob is our risk calculator and software smith – he responds to pull requests faster than WhatsApp messages, but solves both before the coffee gets cold.
            </p>
          </div>

          {/* Christopher's Story */}
          <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-gray-100 px-8 py-8 backdrop-blur-sm">
            <h2 className="text-2xl font-extrabold text-[#16475b] mb-4">ABOUT CHRISTOPHER – creams, KPIs & code</h2>
            <p className="text-gray-800 leading-relaxed">
              Christopher began his journey in a laboratory full of fragrance compounds and pH strips. Over thirteen years, he founded three skincare brands, sold to both salons and lifestyle shoppers – and learned the hard way how cash flows can sting more than acid peeling.
            </p>
            <p className="text-gray-800 leading-relaxed mt-4">
              Now he's traded pipettes for prompt engineering. He loves how AI can massage out smarter decisions and smooth the startup pain for more founders. His passion? Making complicated finance jargon as clear and moisturizing as a good serum formula.
            </p>
            <p className="text-gray-800 leading-relaxed mt-4">
              He now lives, like Jakob, in sunny Mallorca with wife, two children and an unhealthy amount of prototype slides in Google Drive. At our company, Christopher is the storyteller, market strategist and the one who always asks: &quot;How does it feel for the user?&quot; – whether it's about skincare or AI dashboards.
            </p>
          </div>

          {/* Team Conclusion */}
          <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-gray-100 px-8 py-8 backdrop-blur-sm text-center">
            <p className="text-gray-800 leading-relaxed">
              Together they drive FrejFund like a well-oiled poker machine with silky smooth finish – where odds, algorithms and care meet to make entrepreneurship a little easier, much more fun and significantly more investable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 