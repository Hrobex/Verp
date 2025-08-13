import { Link } from 'react-router-dom';
import { BrainCircuit, BookOpen, ShieldCheck, Infinity, Edit2, Download, Save, Code } from 'lucide-react';

const faqData = [
  {
    question: "Is Llama-4 truly free to use?",
    answer: "Yes, absolutely. We believe powerful AI tools should be accessible to everyone. There are no subscriptions, hidden fees, or usage limits. Your curiosity is the only thing that matters."
  },
  {
    question: "What makes Llama-4 different from other AI chatbots?",
    answer: "Llama-4 combines several unique strengths: it leverages massive language models for exceptional reasoning, has a vast context memory to track long conversations, and is powered by an ultra-fast engine, all delivered in a completely free and private experience."
  },
  {
    question: "What kind of tasks does Llama-4 excel at?",
    answer: "It's a highly versatile partner. Use it for brainstorming complex ideas, drafting professional emails and articles, solving coding and logic problems, or even summarizing dense research papers and translating text."
  },
  {
    question: "Are my conversations with Llama-4 private and secure?",
    answer: "Yes. Your privacy and security are our top priority. We do not store your conversation history on our servers—ever. Your chat is saved directly and only in your own browser's local storage, giving you the convenience of picking up where you left off without your data ever leaving your device.."
  }
];

function Llama4Page() {
  return (
    <>
      <title>Llama-4: Free, Unlimited Online AI Chatbot Assistant</title>
      <meta name="description" content="Meet Llama-4, a next-generation AI chat assistant. Ask complex questions, write content, and get instant answers. Completely free, no signup required." />
      <link rel="canonical" href="https://aiconvert.online/llama-4" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/llama-4" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/llama-4" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/llama-4" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Llama-4: Free Online AI Chatbot",
            "description": "A free, unlimited AI chatbot assistant powered by advanced models. Llama-4 offers superior reasoning, vast context memory, and a private chat experience for writing, coding, and complex problem-solving.",
            "operatingSystem": "WEB",
            "applicationCategory": "ProductivityApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "applicationSuite": "AI Convert Online Tools"
          }
        `}
      </script>

      <div className="pt-24 bg-gray-900 text-white min-h-screen font-sans">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

          <section className="text-center mb-12">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-500">
              Llama-4: Free, Unlimited Online AI Chatbot
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto">
              Go beyond the ordinary. It's time for an AI assistant that truly understands you. Ask complex questions, generate creative content, and get instant, intelligent answers.
            </p>
          </section>
          
          <div className="text-center mb-20">
            <Link
              to="/llama-4/chat"
              className="inline-block py-4 px-10 text-lg font-bold text-gray-900 bg-amber-500 rounded-full shadow-lg hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-300 transform hover:scale-105 transition-all duration-300"
            >
              Start Chatting for Free
            </Link>
            <p className="mt-4 text-sm text-gray-300">No Signup Required.</p>
          </div>
          
          <section className="text-center mb-24">
            <h2 className="text-3xl font-bold mb-4">An AI Assistant with Superpowers</h2>
            <p className="max-w-3xl mx-auto text-gray-400 mb-12">
              We didn't just offer another chatbot. We engineered the Llama-4 experience to be your partner in thought and creativity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-emerald-500/20 transition-shadow">
                <BrainCircuit className="h-10 w-10 mx-auto mb-4 text-emerald-400" />
                <h3 className="text-xl font-bold text-white mb-2">Advanced Reasoning</h3>
                <p className="text-gray-300">Challenge it with your toughest problems. Llama-4 excels at understanding complex context, delivering logical and well-analyzed solutions.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-emerald-500/20 transition-shadow">
                <BookOpen className="h-10 w-10 mx-auto mb-4 text-emerald-400" />
                <h3 className="text-xl font-bold text-white mb-2">Vast Context Memory</h3>
                <p className="text-gray-300">Tired of repeating yourself? Its large context window allows it to remember details from long conversations, perfect for multi-step projects.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-emerald-500/20 transition-shadow">
                <ShieldCheck className="h-10 w-10 mx-auto mb-4 text-emerald-400" />
                <h3 className="text-xl font-bold text-white mb-2">Unwavering Reliability</h3>
                <p className="text-gray-300">Our intelligent backend system dynamically routes your requests to ensure high availability, so you always get the best possible response.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-emerald-500/20 transition-shadow">
                <Infinity className="h-10 w-10 mx-auto mb-4 text-emerald-400" />
                <h3 className="text-xl font-bold text-white mb-2">Limitless & Free Forever</h3>
                <p className="text-gray-300">Unleash your creativity without worrying about costs or quotas. A powerful AI chat assistant for free, with no strings attached.</p>
              </div>
            </div>
          </section>

          <section className="text-center mb-24">
            <h2 className="text-3xl font-bold mb-4">A Chat Experience Designed for You</h2>
            <p className="max-w-3xl mx-auto text-gray-400 mb-12">
              We focused on the details to create an interface that's not just powerful, but also intuitive and a pleasure to use.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-amber-500/20 transition-shadow">
                <Edit2 className="h-10 w-10 mx-auto mb-4 text-amber-400" />
                <h3 className="text-xl font-bold text-white mb-2">Edit & Refine</h3>
                <p className="text-gray-300">Made a typo? Easily edit any of your previous messages and regenerate a new response to perfect your conversation.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-amber-500/20 transition-shadow">
                <Download className="h-10 w-10 mx-auto mb-4 text-amber-400" />
                <h3 className="text-xl font-bold text-white mb-2">Export Your Chats</h3>
                <p className="text-gray-300">Keep a permanent record of your ideas. Export your entire conversation as a clean Markdown file with a single click.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-amber-500/20 transition-shadow">
                <Save className="h-10 w-10 mx-auto mb-4 text-amber-400" />
                <h3 className="text-xl font-bold text-white mb-2">Never Lose Context</h3>
                <p className="text-gray-300">Accidentally closed the tab? No problem. Your current chat is automatically saved in your browser, ready for you to pick up.</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-amber-500/20 transition-shadow">
                <Code className="h-10 w-10 mx-auto mb-4 text-amber-400" />
                <h3 className="text-xl font-bold text-white mb-2">Rich Formatting</h3>
                <p className="text-gray-300">Our chat understands and beautifully formats code blocks, lists, and other elements, making complex answers easy to read.</p>
              </div>
            </div>
          </section>

          <section className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Have Questions? We Have Answers.</h2>
            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-emerald-400 mb-2">{faq.question}</h3>
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </>
  );
}

export default Llama4Page;
