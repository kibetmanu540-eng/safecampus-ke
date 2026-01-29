import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  Phone, 
  Building2, 
  Heart, 
  Shield, 
  AlertCircle,
  BookOpen,
  Users,
  ExternalLink,
  Copy,
  CheckCircle,
  MapPin,
  Mail
} from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { gbvOrganisations } from '../data/gbvDirectory';

const ResourcesPage = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedService, setSelectedService] = useState('');
  
  // Show guidance if coming from report page
  const showGuidance = location.state?.showGuidance;
  const incidentType = location.state?.incidentType;

  useEffect(() => {
    if (showGuidance) {
      // Show immediate guidance toast
      toast({
        title: "Report Submitted Successfully",
        description: "Review the guidance below for immediate next steps.",
      });
    }
  }, [showGuidance, toast]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(id);
    setTimeout(() => setCopiedNumber(null), 2000);
    toast({
      title: "Copied to clipboard",
      description: `${text} has been copied.`,
    });
  };

  const allRegions = useMemo(() => {
    const set = new Set();
    gbvOrganisations.forEach(o => (o.regionTags || []).forEach(r => set.add(r)));
    return Array.from(set).sort();
  }, []);

  const allServices = useMemo(() => {
    const set = new Set();
    gbvOrganisations.forEach(o => (o.services || []).forEach(s => set.add(s)));
    return Array.from(set).sort();
  }, []);

  const normalizePhone = (n) => (n || '').replace(/\s+/g, '');

  const filteredOrganisations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return gbvOrganisations.filter(o => {
      const matchesQuery = !q || [o.name, o.whoTheyHelp, o.basedIn, o.coverage]
        .filter(Boolean)
        .some(v => v.toLowerCase().includes(q));
      const matchesRegion = !selectedRegion || (o.regionTags || []).includes(selectedRegion);
      const matchesService = !selectedService || (o.services || []).includes(selectedService);
      return matchesQuery && matchesRegion && matchesService;
    });
  }, [searchQuery, selectedRegion, selectedService]);

  const immediateGuidance = {
    harassment: {
      title: "Online Harassment",
      steps: [
        "Document everything - take screenshots before blocking",
        "Block the harasser on all platforms",
        "Report to the platform (WhatsApp, Facebook, etc.)",
        "Tell someone you trust",
        "Consider reporting to authorities if threats are made"
      ]
    },
    blackmail: {
      title: "Blackmail with Intimate Images",
      steps: [
        "Do NOT pay or comply with demands",
        "Screenshot all communications as evidence",
        "Block the blackmailer immediately",
        "Report to police cyber crime unit",
        "Contact the platforms to remove content",
        "Seek counseling support"
      ]
    },
    stalking: {
      title: "Cyberstalking",
      steps: [
        "Document all contact attempts",
        "Do not respond to any messages",
        "Increase privacy settings on all accounts",
        "Consider changing phone numbers/emails",
        "File a police report with evidence",
        "Inform campus security"
      ]
    },
    doxxing: {
      title: "Doxxing",
      steps: [
        "Document where your information was shared",
        "Contact platforms to remove your personal info",
        "Alert your bank and change passwords",
        "Consider identity monitoring services",
        "File a police report",
        "Inform family/employer about potential harassment"
      ]
    },
    'physical-violence': {
      title: "Physical Violence",
      steps: [
        "If you are in danger, get to a safe place and call 999/112",
        "Seek medical attention for injuries as soon as possible",
        "Document injuries (photos, notes) and keep any evidence safe",
        "Tell someone you trust and consider a safety plan",
        "Consider reporting to authorities or campus security"
      ]
    },
    'sexual-violence': {
      title: "Sexual Violence or Assault",
      steps: [
        "Get to a safe place and seek medical care immediately (PEP/emergency care)",
        "Avoid washing or changing clothes if possible to preserve evidence",
        "Consider a forensic exam within recommended timeframes",
        "Call GBV Hotline 1195 for confidential support",
        "Reach out to trusted support (counselor, friend, family)"
      ]
    },
    'emotional-psychological-abuse': {
      title: "Emotional / Psychological Abuse",
      steps: [
        "Recognize patterns like gaslighting, threats, isolation, control",
        "Talk to a counselor or trusted person to validate your experience",
        "Create a safety plan and set boundaries",
        "Document incidents (journal, screenshots/messages)",
        "Seek legal advice if harassment or threats escalate"
      ]
    },
    'economic-violence': {
      title: "Economic / Financial Abuse",
      steps: [
        "Secure personal documents, bank cards, and passwords",
        "Track financial control, theft, or sabotage incidents",
        "Open a private account if safe, and seek financial counseling",
        "Ask a trusted person to help safeguard resources",
        "Seek legal advice regarding property, maintenance, or theft"
      ]
    },
    'domestic-intimate-partner-violence': {
      title: "Domestic / Intimate Partner Violence",
      steps: [
        "If you are in danger, call 999/112 or GBV Hotline 1195",
        "Prepare an emergency bag and safety plan if you can",
        "Identify safe contacts and code words for help",
        "Document incidents and injuries",
        "Seek shelter or support services as needed"
      ]
    },
    'non-consensual-sharing': {
      title: "Non-consensual Sharing of Images",
      steps: [
        "Collect URLs, screenshots, and timestamps as evidence",
        "Report to platforms and request urgent removal",
        "Avoid engaging with perpetrators",
        "Seek legal support and counseling",
        "Consider reporting to authorities"
      ]
    },
    grooming: {
      title: "Online Grooming",
      steps: [
        "Stop communication and document messages",
        "Block and report profiles to the platform",
        "Tell a trusted adult/support person",
        "Report to authorities if threats or coercion occurred",
        "Seek counseling support"
      ]
    },
    'hate-speech': {
      title: "Gender-based Hate Speech",
      steps: [
        "Document posts/messages with screenshots and links",
        "Report to platforms and consider reporting to authorities",
        "Avoid engaging with perpetrators",
        "Seek community/support networks",
        "Talk to a counselor if impacted"
      ]
    },
    other: {
      title: "Other",
      steps: [
        "Document what happened with as much detail as possible",
        "If you are in danger, call emergency services (999/112)",
        "Talk to someone you trust and consider counseling",
        "Review Safety Tips and relevant resources",
        "Consider legal advice if appropriate"
      ]
    }
  };

  const emergencyContacts = [
    {
      category: "Emergency",
      contacts: [
        { name: "Police Emergency", number: "999", description: "Immediate danger" },
        { name: "Police (Alternative)", number: "112", description: "Emergency from any network" },
        { name: "GBV Toll-Free Hotline", number: "1195", description: "24/7 support, free from any network" },
        { name: "Healthcare Assistance", number: "1199", description: "Medical emergencies" }
      ]
    },
    {
      category: "Support Organizations",
      contacts: [
        { name: "LVCT Health", number: "0700 920920", description: "GBV support and counseling" },
        { name: "Gender Violence Recovery Centre", number: "0719 638006", description: "Nairobi Women's Hospital" },
        { name: "Coalition on Violence Against Women", number: "0722 594794", description: "COVAW Kenya" },
        { name: "FIDA Kenya", number: "0709 928000", description: "Legal aid for women" }
      ]
    },
    {
      category: "University Support",
      contacts: [
        { name: "Egerton Counseling", number: "0713 835846", description: "Student counseling services" },
        { name: "UoN Gender Desk", number: "020 4913193", description: "University of Nairobi" },
        { name: "KU Counseling Centre", number: "0708 784909", description: "Kenyatta University" }
      ]
    }
  ];

  const digitalSafetyTips = [
    {
      title: "Immediate Personal Safety",
      icon: Shield,
      tips: [
        "If you're in danger, move to a safe place and call for help",
        "Emergency: 999 or 112 • GBV Hotline: 1195 (24/7, free)",
        "If sexual violence occurred, seek medical care as soon as possible (PEP/emergency care)",
        "Tell someone you trust and consider a safety plan",
        "Document injuries or damage (photos, notes) and keep any evidence safe"
      ]
    },
    {
      title: "Secure Your Accounts",
      icon: Shield,
      tips: [
        "Enable two-factor authentication on all accounts",
        "Use strong, unique passwords for each platform",
        "Review and update privacy settings regularly",
        "Be cautious about what personal info you share"
      ]
    },
    {
      title: "Document Evidence",
      icon: BookOpen,
      tips: [
        "Screenshot messages, posts, and profiles",
        "Save URLs and timestamps",
        "Keep a written log of incidents",
        "Back up evidence in multiple locations"
      ]
    },
    {
      title: "Protect Your Identity",
      icon: Users,
      tips: [
        "Use privacy-focused browsers and VPNs",
        "Limit location sharing and geotagging",
        "Be selective about friend/follow requests",
        "Google yourself regularly to monitor your digital footprint"
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Support Resources</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          You're not alone. Find immediate help, guidance, and resources to support you.
        </p>
      </div>

      {/* Immediate Guidance Alert (if coming from report) */}
      {showGuidance && immediateGuidance[incidentType] && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <CardTitle className="text-green-900">
                  Immediate Steps for {immediateGuidance[incidentType].title}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-green-800">
              {immediateGuidance[incidentType].steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Resources Tabs */}
      <Tabs defaultValue="emergency" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger className="w-full whitespace-normal text-xs sm:text-sm px-2 py-2" value="emergency">Emergency Contacts</TabsTrigger>
          <TabsTrigger className="w-full whitespace-normal text-xs sm:text-sm px-2 py-2" value="safety">Safety Tips</TabsTrigger>
          <TabsTrigger className="w-full whitespace-normal text-xs sm:text-sm px-2 py-2" value="support">Support Services</TabsTrigger>
          <TabsTrigger className="w-full whitespace-normal text-xs sm:text-sm px-2 py-2" value="directory">GBV Directory</TabsTrigger>
        </TabsList>

        {/* Emergency Contacts Tab */}
        <TabsContent value="emergency" className="space-y-6 mt-6">
          {emergencyContacts.map((category, idx) => (
            <div key={idx}>
              <h3 className="text-xl font-semibold mb-4 text-purple-900">{category.category}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {category.contacts.map((contact, contactIdx) => (
                  <Card key={contactIdx} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Phone className="h-5 w-5 text-purple-600 mt-1" />
                          <div>
                            <p className="font-semibold">{contact.name}</p>
                            <p className="text-2xl font-bold text-purple-600 my-1">{contact.number}</p>
                            <p className="text-sm text-gray-600">{contact.description}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(contact.number, `${idx}-${contactIdx}`)}
                        >
                          {copiedNumber === `${idx}-${contactIdx}` ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Digital Safety Tab */}
        <TabsContent value="safety" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            {digitalSafetyTips.map((section, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <section.icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Support Services Tab */}
        <TabsContent value="support" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 text-pink-600 mr-2" />
                  Counseling & Mental Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Professional counseling can help you process trauma and develop coping strategies.
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => window.open('https://befrienders.org/find-support-now/befrienders-kenya/', '_blank', 'noopener,noreferrer')}
                  >
                    <span>Befrienders Kenya</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => window.open('https://niskize.co.ke/', '_blank', 'noopener,noreferrer')}
                  >
                    <span>Niskize Wellness</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => window.open('https://6923fa286f9fadae6e5771da--chitchatwithdrmeg.netlify.app/', '_blank', 'noopener,noreferrer')}
                  >
                    <span>ChitChat with Dr Meg</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 text-blue-600 mr-2" />
                  Legal Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Get free legal advice and representation for GBV cases.
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => window.open('https://fidakenya.org/', '_blank', 'noopener,noreferrer')}
                  >
                    <span>FIDA Kenya</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => window.open('https://kituochasheria.or.ke/', '_blank', 'noopener,noreferrer')}
                  >
                    <span>Kituo Cha Sheria</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Self-Care Resources */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle>Self-Care & Healing</CardTitle>
              <CardDescription>
                Recovery is a journey. Be patient and kind with yourself.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="p-3 bg-white rounded-lg shadow-sm mb-2">
                    <Heart className="h-8 w-8 text-pink-600 mx-auto" />
                  </div>
                  <p className="font-medium">Practice Self-Compassion</p>
                  <p className="text-sm text-gray-600">Your feelings are valid</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-white rounded-lg shadow-sm mb-2">
                    <Users className="h-8 w-8 text-purple-600 mx-auto" />
                  </div>
                  <p className="font-medium">Build Support Network</p>
                  <p className="text-sm text-gray-600">Connect with trusted people</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-white rounded-lg shadow-sm mb-2">
                    <Shield className="h-8 w-8 text-blue-600 mx-auto" />
                  </div>
                  <p className="font-medium">Set Boundaries</p>
                  <p className="text-sm text-gray-600">Protect your peace</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="directory" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, help description, or location"
              />
            </div>
            <Select value={selectedRegion} onValueChange={(v) => setSelectedRegion(v === '__all__' ? '' : v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Regions</SelectItem>
                {allRegions.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedService} onValueChange={(v) => setSelectedService(v === '__all__' ? '' : v)}>
              <SelectTrigger>
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Services</SelectItem>
                {allServices.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(selectedRegion || selectedService || searchQuery) && (
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => { setSelectedRegion(''); setSelectedService(''); setSearchQuery(''); }}>Clear filters</Button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {filteredOrganisations.map((org) => (
              <Card key={org.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{org.name}</CardTitle>
                  {org.whoTheyHelp && (
                    <CardDescription>{org.whoTheyHelp}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2 text-sm text-gray-700">
                    <MapPin className="h-4 w-4 text-purple-600 mt-0.5" />
                    <div>
                      <div className="font-medium">{org.basedIn}</div>
                      {org.coverage && <div className="text-gray-600">Coverage: {org.coverage}</div>}
                    </div>
                  </div>

                  {org.email && (
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <Mail className="h-4 w-4 text-purple-600" />
                      <a href={`mailto:${org.email}`} className="underline">{org.email}</a>
                    </div>
                  )}

                  {org.services && (
                    <div className="flex flex-wrap gap-2">
                      {org.services.map(s => (
                        <span key={s} className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">{s}</span>
                      ))}
                    </div>
                  )}

                  {org.phones && org.phones.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-2">
                      {org.phones.map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded-md border p-2">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-purple-600" />
                            <span className="font-medium">{p}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => { window.location.href = `tel:${normalizePhone(p)}`; }}>Call</Button>
                            <Button size="sm" variant="ghost" onClick={() => copyToClipboard(p, `${org.id}-${idx}`)}>
                              {copiedNumber === `${org.id}-${idx}` ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {org.notes && (
                    <div className="text-sm text-gray-600">{org.notes}</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourcesPage;
