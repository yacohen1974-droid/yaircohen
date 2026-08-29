"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, Instagram, Linkedin, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlobalSettings {
  siteName?: string;
  siteTagline?: string;
  siteDescription?: string;
  siteKeywords?: string;
  primaryColor?: string;
  navItems?: Array<{ label: string; href: string }>;
  footerItems?: Array<{ label: string; href: string }>;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  [key: string]: any;
}

const PRESET_COLORS = [
  { name: 'כחול מקצועי', value: '213 75% 35%' },
  { name: 'כחול נייבי', value: '220 60% 18%' },
  { name: 'כחול בהיר', value: '210 80% 50%' },
  { name: 'זהב', value: '42 70% 48%' },
  { name: 'ירוק כסף', value: '155 15% 45%' },
  { name: 'אפור כחלחל', value: '215 25% 40%' },
  { name: 'טרקוטה', value: '15 35% 50%' },
  { name: 'אפור כהה', value: '220 10% 30%' },
];

interface GlobalSettingsEditorProps {
  settings: GlobalSettings;
  onChange: (settings: GlobalSettings) => void;
  availablePages: Array<{ id: string; name: string }>;
}

export function GlobalSettingsEditor({ settings, onChange, availablePages }: GlobalSettingsEditorProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  const handleNavItemChange = (index: number, field: string, value: string) => {
    const items = [...(settings.navItems || [])];
    items[index] = { ...items[index], [field]: value };
    handleChange('navItems', items);
  };

  const handleAddNavItem = () => {
    const items = [...(settings.navItems || [])];
    items.push({ label: '', href: '' });
    handleChange('navItems', items);
  };

  const handleRemoveNavItem = (index: number) => {
    const items = (settings.navItems || []).filter((_, i) => i !== index);
    handleChange('navItems', items);
  };

  const handleFooterItemChange = (index: number, field: string, value: string) => {
    const items = [...(settings.footerItems || [])];
    items[index] = { ...items[index], [field]: value };
    handleChange('footerItems', items);
  };

  const handleAddFooterItem = () => {
    const items = [...(settings.footerItems || [])];
    items.push({ label: '', href: '' });
    handleChange('footerItems', items);
  };

  const handleRemoveFooterItem = (index: number) => {
    const items = (settings.footerItems || []).filter((_, i) => i !== index);
    handleChange('footerItems', items);
  };

  const handleSocialChange = (key: string, value: string) => {
    const social = { ...settings.socialLinks };
    if (value) social[key] = value;
    else delete social[key];
    handleChange('socialLinks', social);
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">הגדרות בסיסיות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="siteName">שם האתר</Label>
            <Input
              id="siteName"
              value={settings.siteName || ''}
              onChange={(e) => handleChange('siteName', e.target.value)}
              placeholder="למשל: יאיר כהן"
            />
          </div>

          <div>
            <Label htmlFor="siteTagline">טאגליין</Label>
            <Input
              id="siteTagline"
              value={settings.siteTagline || ''}
              onChange={(e) => handleChange('siteTagline', e.target.value)}
              placeholder="תיאור קצר"
            />
          </div>

          <div>
            <Label htmlFor="siteDescription">תיאור האתר (לחיפוש)</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription || ''}
              onChange={(e) => handleChange('siteDescription', e.target.value)}
              placeholder="תיאור ל-SEO (160 תווים)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="siteKeywords">מילות מפתח</Label>
            <Input
              id="siteKeywords"
              value={settings.siteKeywords || ''}
              onChange={(e) => handleChange('siteKeywords', e.target.value)}
              placeholder="מילות מפתח מופרדות בפסיקים"
            />
          </div>
        </CardContent>
      </Card>

      {/* Color Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">צבע ראשי</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map(({ name, value }) => (
              <button
                key={value}
                onClick={() => handleChange('primaryColor', value)}
                className={cn(
                  'w-12 h-12 rounded border-2 transition-all',
                  settings.primaryColor === value
                    ? 'border-black scale-110'
                    : 'border-stone-200 hover:border-stone-400'
                )}
                style={{ backgroundColor: `hsl(${value})` }}
                title={name}
              />
            ))}
          </div>
          <p className="text-xs text-stone-600">או הזן ערך HSL:</p>
          <Input
            value={settings.primaryColor || ''}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
            placeholder="213 75% 35%"
          />
        </CardContent>
      </Card>

      {/* Navigation Menu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">תפריט ניווט</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(settings.navItems || []).map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={item.label}
                onChange={(e) => handleNavItemChange(idx, 'label', e.target.value)}
                placeholder="שם הקישור"
              />
              <Select value={item.href} onValueChange={(v) => handleNavItemChange(idx, 'href', v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="בחר דף" />
                </SelectTrigger>
                <SelectContent>
                  {availablePages.map((page) => (
                    <SelectItem key={page.id} value={`/${page.id}`}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={() => handleRemoveNavItem(idx)}>
                מחק
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={handleAddNavItem} className="w-full">
            הוסף קישור
          </Button>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">קישורי תחתית</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(settings.footerItems || []).map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={item.label}
                onChange={(e) => handleFooterItemChange(idx, 'label', e.target.value)}
                placeholder="שם הקישור"
              />
              <Input
                value={item.href}
                onChange={(e) => handleFooterItemChange(idx, 'href', e.target.value)}
                placeholder="כתובת (URL או /)
"
              />
              <Button variant="ghost" size="sm" onClick={() => handleRemoveFooterItem(idx)}>
                מחק
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={handleAddFooterItem} className="w-full">
            הוסף קישור
          </Button>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">פרטי יצירת קשר</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">אימייל</Label>
            <div className="flex gap-2">
              <Mail size={18} className="text-stone-400 mt-2" />
              <Input
                id="email"
                type="email"
                value={settings.contactEmail || ''}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">טלפון</Label>
            <div className="flex gap-2">
              <Phone size={18} className="text-stone-400 mt-2" />
              <Input
                id="phone"
                value={settings.contactPhone || ''}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">רשתות חברתיות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <div className="flex gap-2">
              <Instagram size={18} className="text-stone-400 mt-2" />
              <Input
                id="instagram"
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                placeholder="@username"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <div className="flex gap-2">
              <Linkedin size={18} className="text-stone-400 mt-2" />
              <Input
                id="linkedin"
                value={settings.socialLinks?.linkedin || ''}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                placeholder="username"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="youtube">YouTube</Label>
            <div className="flex gap-2">
              <Youtube size={18} className="text-stone-400 mt-2" />
              <Input
                id="youtube"
                value={settings.socialLinks?.youtube || ''}
                onChange={(e) => handleSocialChange('youtube', e.target.value)}
                placeholder="@channel"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
