import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Shield, 
  Heart, 
  Users, 
  Lock, 
  AlertTriangle, 
  Phone,
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const HomePage = () => {
  const stats = [
    { value: '90%', label: 'of students witness GBV' },
    { value: '39%', label: 'experience it personally' },
    { value: '1195', label: 'National GBV Hotline' },
    { value: '24/7', label: 'Anonymous Support' },
  ];

  const features = [
    {
      icon: Lock,
      title: 'Complete Anonymity',
      description: 'Report incidents without revealing your identity. Your safety is our priority.',
      color: 'text-purple-600'
    },
    {
      icon: AlertTriangle,
      title: 'Immediate Guidance',
      description: 'Get instant, actionable advice on what to do after experiencing GBV.',
      color: 'text-pink-600'
    },
    {
      icon: Phone,
      title: 'Connect to Help',
      description: 'Direct links to campus counselors, national hotlines, and support organizations.',
      color: 'text-blue-600'
    },
    {
      icon: FileText,
      title: 'Document Safely',
      description: 'Securely save evidence and screenshots for future action if needed.',
      color: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4">
          <Sparkles className="h-4 w-4 text-purple-600 mr-2" />
          <span className="text-sm font-medium text-purple-900">UNiTE to End Gender-Based Violence</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
          Report GBV
          <br />
          <span className="text-4xl md:text-5xl">Anonymously & Safely</span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          You're not alone. SafeCampus KE provides a secure, anonymous platform for 
          Kenyan university students to report gender-based violence (online or offline) and get immediate support.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/report">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              Report Incident
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/resources">
            <Button size="lg" variant="outline" className="border-purple-300 hover:bg-purple-50">
              Get Help Now
              <Heart className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center border-purple-200 bg-gradient-to-br from-white to-purple-50">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600">{stat.value}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-purple-200">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <div className={`p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="mt-2">{feature.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </section>

      {/* Campaign Banner */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Heart className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-bold">Stand Against Gender-Based Violence</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">Create Safer Communities</p>
          <p className="text-md opacity-80 max-w-3xl mx-auto">
            Take action year-round to prevent harassment, stalking, and abuse — online or offline. 
            Find practical tools and support whenever you need it.
          </p>
          <div className="pt-4">
            <Link to="/resources">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Explore Resources
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 pb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Break the Silence. Take Action.
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Gender-based violence is real violence. Whether you've experienced it, witnessed it, 
          or want to be an ally, your voice matters. Together, we can create safer spaces 
          online and offline for everyone.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/report">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Make a Report
            </Button>
          </Link>
          <Link to="/resources">
            <Button size="lg" variant="outline">
              Access Resources
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
