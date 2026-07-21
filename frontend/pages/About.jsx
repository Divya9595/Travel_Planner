import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";

const values = [
  {
    icon: "🎯",
    title: "Planning Over Booking",
    description:
      "We don't sell tickets or hotels. We help you plan smarter — so when you arrive, you know exactly what to do, where to eat, and what to expect.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Personalization",
    description:
      "Every itinerary is built around your preferences — budget, pace, interests, and travel style. No generic templates.",
  },
  {
    icon: "🧳",
    title: "End-to-End Preparation",
    description:
      "From packing lists and to-do checklists to flight details and reminders — we cover every detail before you leave home.",
  },
  {
    icon: "🌍",
    title: "Destinations Worldwide",
    description:
      "Whether it's the beaches of Bali, the streets of Tokyo, or the mountains of Manali — our AI knows what works for every destination.",
  },
];

function About() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar publicMode />

      {/* Hero */}
      <section className="py-20 px-6 flex-1">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-white text-center mb-6">
            About Horizon Travel
          </h1>
          <p className="text-indigo-400 text-center text-lg mb-12">
            We help you plan trips, not book them
          </p>

          <div className="space-y-8 text-slate-300 leading-relaxed">
            <p className="text-lg text-center max-w-3xl mx-auto">
              Horizon Travel is an AI-powered trip planning platform. We don't
              sell flights or hotels — we give you the tools to plan every
              detail of your journey before you leave home. From personalized
              itineraries to packing checklists, we make sure you travel
              prepared.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-14">
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-indigo-400 mb-2">
                  AI-Driven
                </div>
                <div className="text-slate-400 text-sm">
                  Smart itinerary generation
                </div>
              </div>
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-indigo-400 mb-2">
                  100% Free
                </div>
                <div className="text-slate-400 text-sm">
                  No booking fees or hidden charges
                </div>
              </div>
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-indigo-400 mb-2">
                  Every Detail
                </div>
                <div className="text-slate-400 text-sm">
                  Weather, packing, reminders & more
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6 bg-slate-800/50">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto">
            Travel planning shouldn't feel like a second job. Our mission is to
            remove the overwhelm from trip planning by using AI to create
            personalized, day-by-day itineraries — so you can spend less time
            researching and more time getting excited about your trip.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            What We Believe In
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
            The principles that guide everything we build
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-6 rounded-2xl bg-slate-800 border border-slate-700/50 hover:border-indigo-500/30 transition-colors"
              >
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {v.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Start Planning Your Trip
          </h2>
          <p className="text-slate-400 mb-8">
            Sign up for free and let our AI build your next itinerary
          </p>
          <a
            href="/register"
            className="inline-block rounded-xl bg-indigo-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-400 transition-all hover:scale-105"
          >
            Get Started — It's Free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
