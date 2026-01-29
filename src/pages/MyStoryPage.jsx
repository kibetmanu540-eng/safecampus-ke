import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Heart, Phone, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyStoryPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Hero / Intro */}
      <section className="text-center space-y-4">
        <p className="inline-flex items-center bg-purple-100 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-purple-800">
          <Heart className="h-3 w-3 mr-2 text-pink-500" />
          My Story & Why I Built This
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Why I Built <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">SafeCampus KE</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          My name is <span className="font-semibold">Immanuel K. Ronoh</span>. I am a survivor of gender-based
          violence, a 3rd-year student at Egerton University, and a developer who believes
          that technology can create safer spaces for all of us.
        </p>
      </section>

      {/* Profile + Story */}
      <section className="grid md:grid-cols-[1.1fr,1.4fr] gap-8 items-start">
        {/* Profile Card */}
        <Card className="border-purple-200 bg-gradient-to-b from-white to-purple-50">
          <CardHeader className="flex flex-col items-center text-center space-y-4">
            {/* Profile photo */}
            <div className="relative">
              <div className="h-40 w-40 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[3px] shadow-lg">
                <img
                  src="/immanuel.jpg"
                  alt="Immanuel K. Ronoh"
                  className="h-full w-full rounded-full object-cover bg-white"
                />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Immanuel K. Ronoh</CardTitle>
              <CardDescription className="mt-1 text-base">
                Survivor • Student Developer • SafeCampus KE Founder
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-700">
            <p>
              I am a 3rd-year student at <span className="font-medium">Egerton University</span>, passionate about
              using code to solve real problems in our communities.
            </p>
            <p>
              I also carry a very personal reason for building this platform: I am a
              <span className="font-semibold"> survivor of gender-based violence</span>, both digital and physical. I
              know how confusing, isolating, and frightening it can be when abuse happens,
              especially when it follows you from offline spaces into your phone and online life.
            </p>
            <p>
              SafeCampus KE is my way of turning pain into purpose — so that no one has to
              feel alone, silenced, or ashamed because of what they went through.
            </p>
          </CardContent>
        </Card>

        {/* Long-form story */}
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle>Turning Experience into Action</CardTitle>
            <CardDescription>
              Why GBV, why students, and why now.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Our everyday lives as students span offline spaces and digital platforms — on campus,
              in hostels, WhatsApp groups, Instagram, TikTok, Telegram, and more. Harm can occur
              anywhere: harassment, stalking, sexual violence, non-consensual sharing of intimate images,
              blackmail, and more.
            </p>
            <p>
              As someone who has experienced gender-based violence, I understand how hard it
              can be to speak up. Fear of being judged, not believed, or blamed often keeps
              survivors silent. Many of us also don&apos;t know where to report or who to trust.
            </p>
            <p>
              I created SafeCampus KE to be:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>An <span className="font-medium">anonymous and safe place</span> to document what happened.</li>
              <li>A way to get <span className="font-medium">immediate guidance</span> on what to do next.</li>
              <li>A bridge between students and <span className="font-medium">real support services</span> — counselors, hotlines, and GBV organizations.</li>
              <li>A tool to help universities see the <span className="font-medium">real scale of GBV</span> and take action.</li>
            </ul>
            <p>
              This platform is not just a project. It&apos;s a commitment to every student who
              has been hurt online or offline and felt like they had nowhere to go.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Contact & Support */}
      <section className="space-y-6">
        <Card className="border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle>Need someone to talk to?</CardTitle>
                <CardDescription>
                  I may not have all the answers, but I&apos;m here to listen.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-700">
            <p>
              If you&apos;ve experienced GBV and just need someone who understands to
              hear you out, you can reach out to me directly. I&apos;ll do my best to listen,
              believe you, and point you towards professional support where needed.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white/80 rounded-lg border border-pink-100">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Talk to Immanuel</p>
                  <p className="text-lg font-semibold text-gray-900">+254 741 218 862</p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end space-y-2">
                <a href="tel:+254741218862">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto">
                    Call / WhatsApp
                  </Button>
                </a>
                <p className="text-[11px] text-gray-500 max-w-xs text-left sm:text-right">
                  Please note: I&apos;m just one person and not an emergency service. In
                  immediate danger, contact the police (999 / 112) or the GBV Hotline (1195).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to app CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/report">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              Go to Anonymous Report Form
            </Button>
          </Link>
          <Link to="/resources">
            <Button size="lg" variant="outline" className="border-purple-300 hover:bg-purple-50">
              View Resources & Hotlines
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MyStoryPage;
