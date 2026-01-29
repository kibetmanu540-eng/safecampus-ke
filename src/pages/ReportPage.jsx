import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useToast } from '../components/ui/use-toast';
import { AlertCircle, Shield, Upload, Send, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../lib/api';

const ReportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    university: '',
    description: '',
    platform: '',
    platformProfile: '',
    suspectName: '',
    suspectUsername: '',
    suspectContact: '',
    incidentDate: '',
    incidentLocation: '',
    witnesses: '',
    victimContact: '',
    evidence: []
  });

  const incidentTypes = [
    { value: 'physical-violence', label: 'Physical Violence (hitting, slapping, physical assault)' },
    { value: 'sexual-violence', label: 'Sexual Violence or Assault' },
    { value: 'emotional-psychological-abuse', label: 'Emotional / Psychological Abuse' },
    { value: 'economic-violence', label: 'Economic / Financial Abuse' },
    { value: 'domestic-intimate-partner-violence', label: 'Domestic / Intimate Partner Violence' },
    { value: 'harassment', label: 'Harassment (online or offline)' },
    { value: 'blackmail', label: 'Blackmail with Intimate Images' },
    { value: 'stalking', label: 'Stalking (online or offline)' },
    { value: 'doxxing', label: 'Doxxing (Sharing Personal Info)' },
    { value: 'non-consensual-sharing', label: 'Non-consensual Sharing of Images' },
    { value: 'grooming', label: 'Online Grooming' },
    { value: 'hate-speech', label: 'Gender-based Hate Speech' },
    { value: 'other', label: 'Other' }
  ];

  const universities = [
    { value: 'egerton', label: 'Egerton University' },
    { value: 'uon', label: 'University of Nairobi' },
    { value: 'ku', label: 'Kenyatta University' },
    { value: 'moi', label: 'Moi University' },
    { value: 'jkuat', label: 'JKUAT' },
    { value: 'maseno', label: 'Maseno University' },
    { value: 'tu', label: 'Technical University of Kenya' },
    { value: 'other', label: 'Other' }
  ];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) {
      setFormData({ ...formData, evidence: [] });
      return;
    }

    const tooLarge = files.find((file) => file.size > 25 * 1024 * 1024);
    if (tooLarge) {
      toast({
        title: "File too large",
        description: "Each file must be smaller than 25MB",
        variant: "destructive"
      });
      return;
    }

    setFormData({ ...formData, evidence: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.type || !formData.description) {
      toast({
        title: "Required fields missing",
        description: "Please select an incident type and provide a description",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('type', formData.type);
      payload.append('university', formData.university || 'not_specified');
      payload.append('description', formData.description);
      payload.append('status', 'new');
      payload.append('clientId', currentUser?.clientId || 'anonymous');
      payload.append('platform', formData.platform || '');
      payload.append('platformProfile', formData.platformProfile || '');
      payload.append('suspectName', formData.suspectName || '');
      payload.append('suspectUsername', formData.suspectUsername || '');
      payload.append('suspectContact', formData.suspectContact || '');
      payload.append('incidentDate', formData.incidentDate || '');
      payload.append('incidentLocation', formData.incidentLocation || '');
      payload.append('witnesses', formData.witnesses || '');
      payload.append('victimContact', formData.victimContact || '');
      if (Array.isArray(formData.evidence) && formData.evidence.length > 0) {
        formData.evidence.forEach((file) => {
          payload.append('evidence', file);
        });
      }

      const response = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      toast({
        title: "Report submitted successfully",
        description: "Thank you for your courage in reporting this incident.",
      });

      // Navigate to guidance page
      navigate('/resources', { 
        state: { 
          showGuidance: true, 
          incidentType: formData.type 
        } 
      });
      
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error submitting report",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center bg-purple-100 px-4 py-2 rounded-full">
          <Shield className="h-4 w-4 text-purple-600 mr-2" />
          <span className="text-sm font-medium text-purple-900">Your report is completely anonymous</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Report GBV (Online or Offline)</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your safety and privacy are our top priorities. This form helps you document 
          what happened and connects you with appropriate support.
        </p>
      </div>

      {/* Important Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <CardTitle className="text-orange-900">Important Safety Information</CardTitle>
              <CardDescription className="text-orange-800 mt-2">
                If you are in immediate danger, please call:
              </CardDescription>
              <ul className="list-disc list-inside mt-2 space-y-1 text-orange-900">
                <li><strong>Police:</strong> 999 or 112</li>
                <li><strong>GBV Hotline:</strong> 1195 (free, 24/7)</li>
                <li><strong>Healthcare Assistance:</strong> 1199</li>
              </ul>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Report Form */}
      <Card>
        <CardHeader>
          <CardTitle>Incident Details</CardTitle>
          <CardDescription>
            All fields marked with * are required. Your identity will never be revealed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Incident Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type of GBV *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select the type of incident" />
                </SelectTrigger>
                <SelectContent>
                  {incidentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* University */}
            <div className="space-y-2">
              <Label htmlFor="university">University (Optional)</Label>
              <Select 
                value={formData.university} 
                onValueChange={(value) => setFormData({ ...formData, university: value })}
              >
                <SelectTrigger id="university">
                  <SelectValue placeholder="Select your university" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map(uni => (
                    <SelectItem key={uni.value} value={uni.value}>
                      {uni.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                This helps us understand patterns but is not required
              </p>
            </div>

            {/* Platform & Online Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform (e.g. WhatsApp, Instagram, TikTok)</Label>
                <Input
                  id="platform"
                  type="text"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  placeholder="Platform where this happened (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platformProfile">Profile or group link (optional)</Label>
                <Input
                  id="platformProfile"
                  type="text"
                  value={formData.platformProfile}
                  onChange={(e) => setFormData({ ...formData, platformProfile: e.target.value })}
                  placeholder="Paste the profile or group link if you have it"
                />
              </div>
            </div>

            {/* Suspect Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="suspectName">Name of person (if known, optional)</Label>
                <Input
                  id="suspectName"
                  type="text"
                  value={formData.suspectName}
                  onChange={(e) => setFormData({ ...formData, suspectName: e.target.value })}
                  placeholder="Their name if you know it"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suspectUsername">Username / handle on the platform (optional)</Label>
                <Input
                  id="suspectUsername"
                  type="text"
                  value={formData.suspectUsername}
                  onChange={(e) => setFormData({ ...formData, suspectUsername: e.target.value })}
                  placeholder="e.g. @username or phone used on WhatsApp"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suspectContact">Suspect contact (phone or email, optional)</Label>
                <Input
                  id="suspectContact"
                  type="text"
                  value={formData.suspectContact}
                  onChange={(e) => setFormData({ ...formData, suspectContact: e.target.value })}
                  placeholder="Phone number or email they used"
                />
              </div>
            </div>

            {/* Incident Context */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="incidentDate">Date of incident(s) (optional)</Label>
                <Input
                  id="incidentDate"
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incidentLocation">Where did this mostly happen? (optional)</Label>
                <Input
                  id="incidentLocation"
                  type="text"
                  value={formData.incidentLocation}
                  onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })}
                  placeholder="e.g. WhatsApp + your hostel, on campus, online only"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="witnesses">Witnesses or people who know (optional)</Label>
                <Textarea
                  id="witnesses"
                  value={formData.witnesses}
                  onChange={(e) => setFormData({ ...formData, witnesses: e.target.value })}
                  placeholder="Names or contacts of people who may have witnessed or know about this"
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Survivor Contact (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="victimContact">Your phone number (optional)</Label>
              <Input
                id="victimContact"
                type="tel"
                value={formData.victimContact}
                onChange={(e) => setFormData({ ...formData, victimContact: e.target.value })}
                placeholder="Phone number if you want someone to reach out to you (e.g. 07xx xxx xxx)"
              />
              <p className="text-xs text-gray-500">
                This is optional. Only share a contact if you feel safe being contacted by a counselor or admin.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">What happened? *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Please describe what happened. Include any relevant details like location or platform (e.g. WhatsApp, Facebook), frequency, and impact on you. Remember, this is anonymous and confidential."
                rows={6}
                className="resize-none"
              />
              <p className="text-sm text-gray-500">
                Take your time. Share as much or as little as you're comfortable with.
              </p>
            </div>

            {/* Evidence Upload */}
            <div className="space-y-2">
              <Label htmlFor="evidence">Evidence (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <Input
                  id="evidence"
                  type="file"
                  accept="image/*,.pdf,audio/*,video/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label
                  htmlFor="evidence"
                  className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium"
                >
                  Click to upload screenshots or documents
                </Label>
                {Array.isArray(formData.evidence) && formData.evidence.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected {formData.evidence.length} file(s):{' '}
                    {formData.evidence.map((file) => file.name).join(', ')}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Images, PDFs, audio (e.g. MP3) or video (e.g. MP4) up to 25MB each. Files are encrypted and stored securely.
                </p>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-purple-600 mt-0.5" />
                <div className="text-sm text-purple-900">
                  <p className="font-medium mb-1">Your Privacy is Protected</p>
                  <ul className="list-disc list-inside space-y-1 text-purple-800">
                    <li>No personal information is collected</li>
                    <li>Reports are encrypted and secure</li>
                    <li>You cannot be identified from this report</li>
                    <li>Data is used only for support and advocacy</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>Submitting...</>
                ) : (
                  <>
                    Submit Report
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;
