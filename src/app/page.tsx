'use client';

import { useState, useEffect } from 'react';
import { SiteGeneratorForm } from '@/components/SiteGeneratorForm';
import { GeneratedSiteList } from '@/components/GeneratedSiteList';
import { GenerationLogTable } from '@/components/GenerationLogTable';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { GeneratedSite, GenerationLog, SiteGenerationFormData } from '@/types';
import { generateSiteAction } from './actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const LOCAL_STORAGE_SITES_KEY = 'webforge_ai_generated_sites';
const LOCAL_STORAGE_LOGS_KEY = 'webforge_ai_generation_logs';

export default function WebForgePage() {
  const [generatedSites, setGeneratedSites] = useState<GeneratedSite[]>([]);
  const [generationLogs, setGenerationLogs] = useState<GenerationLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedSites = localStorage.getItem(LOCAL_STORAGE_SITES_KEY);
      if (storedSites) {
        setGeneratedSites(JSON.parse(storedSites));
      }
      const storedLogs = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
      if (storedLogs) {
        setGenerationLogs(JSON.parse(storedLogs));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      // Potentially clear corrupted data or notify user
      localStorage.removeItem(LOCAL_STORAGE_SITES_KEY);
      localStorage.removeItem(LOCAL_STORAGE_LOGS_KEY);
    }
  }, []);

  useEffect(() => {
    try {
      if (generatedSites.length > 0 || localStorage.getItem(LOCAL_STORAGE_SITES_KEY)) {
         localStorage.setItem(LOCAL_STORAGE_SITES_KEY, JSON.stringify(generatedSites));
      }
    } catch (error) {
      console.error("Failed to save sites to localStorage", error);
      toast({
        variant: "destructive",
        title: "Storage Error",
        description: "Could not save generated sites. Your browser's local storage might be full or disabled.",
      });
    }
  }, [generatedSites, toast]);

  useEffect(() => {
     try {
      if (generationLogs.length > 0 || localStorage.getItem(LOCAL_STORAGE_LOGS_KEY)) {
        localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(generationLogs));
      }
    } catch (error) {
      console.error("Failed to save logs to localStorage", error);
       toast({
        variant: "destructive",
        title: "Storage Error",
        description: "Could not save generation logs. Your browser's local storage might be full or disabled.",
      });
    }
  }, [generationLogs, toast]);

  const handleFormSubmit = async (formData: SiteGenerationFormData) => {
    setIsLoading(true);
    const newLogEntryBase = {
      id: crypto.randomUUID(),
      topic: formData.topic,
      style: formData.style,
      sectionsCount: formData.numSections,
      timestamp: new Date().toISOString(),
    };

    try {
      const result = await generateSiteAction(formData);

      if (result.success && result.siteData) {
        setGeneratedSites((prevSites) => [result.siteData!, ...prevSites]);
        setGenerationLogs((prevLogs) => [
          { ...newLogEntryBase, status: 'success', siteId: result.siteData!.id },
          ...prevLogs,
        ]);
        toast({
          title: 'Website Generated!',
          description: `Successfully created: ${result.siteData.title}`,
        });
      } else {
        setGenerationLogs((prevLogs) => [
          { ...newLogEntryBase, status: 'failure', error: result.error || "Unknown error" },
          ...prevLogs,
        ]);
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: result.error || 'An unknown error occurred.',
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'A client-side error occurred.';
      setGenerationLogs((prevLogs) => [
        { ...newLogEntryBase, status: 'failure', error: errorMessage },
        ...prevLogs,
      ]);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <SiteGeneratorForm onSubmit={handleFormSubmit} isLoading={isLoading} />

      <Separator />
      
      <Tabs defaultValue="sites" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto">
          <TabsTrigger value="sites" className="font-headline text-lg">Generated Sites</TabsTrigger>
          <TabsTrigger value="logs" className="font-headline text-lg">Generation Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="sites">
           <section aria-labelledby="generated-sites-heading">
            <h2 id="generated-sites-heading" className="text-3xl font-headline text-center mb-8 text-primary">
              Your AI-Forged Websites
            </h2>
            <GeneratedSiteList sites={generatedSites} />
          </section>
        </TabsContent>
        <TabsContent value="logs">
          <section aria-labelledby="generation-logs-heading">
            <h2 id="generation-logs-heading" className="text-3xl font-headline text-center mb-8 text-primary">
              Activity Logs
            </h2>
            <GenerationLogTable logs={generationLogs} />
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
