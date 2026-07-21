import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";

function Contact() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar publicMode />

      <section className="py-20 px-6 flex-1">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-white text-center mb-6">
            Get In Touch
          </h1>
          <p className="text-indigo-400 text-center text-lg mb-12">
            We'd love to hear from you
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-slate-800 border border-slate-700/50 rounded-2xl">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="text-white font-semibold mb-2">Address</h3>
              <p className="text-slate-400 text-sm">
                123 Travel Street
                <br />
                Adventure City, AC 10001
              </p>
            </div>
            <div className="text-center p-8 bg-slate-800 border border-slate-700/50 rounded-2xl">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="text-white font-semibold mb-2">Email</h3>
              <p className="text-slate-400 text-sm">
                info@horizontravel.com
                <br />
                support@horizontravel.com
              </p>
            </div>
            <div className="text-center p-8 bg-slate-800 border border-slate-700/50 rounded-2xl">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="text-white font-semibold mb-2">Phone</h3>
              <p className="text-slate-400 text-sm">
                +1 (555) 123-4567
                <br />
                +1 (555) 987-6543
              </p>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6">
              Send Us a Message
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="block w-full rounded-xl bg-white/5 px-3.5 py-2.5 text-base text-white border border-white/10 placeholder:text-slate-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="block w-full rounded-xl bg-white/5 px-3.5 py-2.5 text-base text-white border border-white/10 placeholder:text-slate-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  className="block w-full rounded-xl bg-white/5 px-3.5 py-2.5 text-base text-white border border-white/10 placeholder:text-slate-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us about your travel plans..."
                  className="block w-full rounded-xl bg-white/5 px-3.5 py-2.5 text-base text-white border border-white/10 placeholder:text-slate-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="rounded-xl bg-indigo-500 px-8 py-3 text-sm font-semibold text-white hover:bg-indigo-400 transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;
