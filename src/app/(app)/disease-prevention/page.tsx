'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, X, ShieldAlert, Leaf, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { getDiseaseDiagnosis } from '@/lib/actions';
import type { DiagnoseCropDiseaseOutput } from '@/ai/flows/diagnose-crop-disease';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// List of common crop diseases - this could be expanded
const commonDiseases = [
    'Powdery Mildew',
    'Rust',
    'Blight (Early/Late)',
    'Downy Mildew',
    'Fusarium Wilt',
    'Verticillium Wilt',
    'Black Spot',
    'Anthracnose',
    'Mosaic Virus',
    'Canker'
];

export default function DiseasePreventionPage() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [selectedDisease, setSelectedDisease] = useState<string>('');
    const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<DiagnoseCropDiseaseOutput | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

    useEffect(() => {
        if (isCameraOpen) {
            const getCameraPermission = async () => {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({video: true});
                setHasCameraPermission(true);
        
                if (videoRef.current) {
                  videoRef.current.srcObject = stream;
                }
              } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                setIsCameraOpen(false);
                toast({
                  variant: 'destructive',
                  title: 'Camera Access Denied',
                  description: 'Please enable camera permissions in your browser settings.',
                });
              }
            };
        
            getCameraPermission();

            // Cleanup function
            return () => {
                if (videoRef.current && videoRef.current.srcObject) {
                    (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                }
            }
        }
    }, [isCameraOpen, toast]);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUri = reader.result as string;
                setUploadedPhoto(dataUri);
                setSelectedDisease(''); // Clear disease selection if photo is uploaded
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
                const dataUri = canvasRef.current.toDataURL('image/jpeg');
                setUploadedPhoto(dataUri);
                setIsCameraOpen(false);
            }
        }
    }

    const handleGetDiagnosis = async () => {
        if (!selectedDisease && !uploadedPhoto) {
            toast({
                variant: 'destructive',
                title: t('disease_prevention.toast_input_required_title'),
                description: t('disease_prevention.toast_input_required_description'),
            });
            return;
        }

        setIsLoading(true);
        setResults(null);

        const input = {
            diseaseName: selectedDisease || undefined,
            photoDataUri: uploadedPhoto || undefined,
        };

        const response = await getDiseaseDiagnosis(input);

        if (response.success && response.data) {
            setResults(response.data);
        } else {
            toast({
                variant: 'destructive',
                title: t('disease_prevention.toast_error_title'),
                description: response.error || t('disease_prevention.toast_error_description'),
            });
        }

        setIsLoading(false);
    };
    
    const handleNewDiagnosis = () => {
        setResults(null);
        setSelectedDisease('');
        setUploadedPhoto(null);
    };

    if (isCameraOpen) {
        return (
            <div className="space-y-4">
                 <h1 className="text-3xl font-bold font-headline">Take a Photo</h1>
                <p className="text-muted-foreground">
                    Center the affected plant part in the frame.
                </p>
                <video ref={videoRef} className="w-full aspect-video rounded-md bg-secondary" autoPlay muted playsInline />
                {hasCameraPermission === false && (
                    <Alert variant="destructive">
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                        Please allow camera access to use this feature. You may need to change permissions in your browser settings.
                      </AlertDescription>
                    </Alert>
                )}
                 <canvas ref={canvasRef} className="hidden"></canvas>
                 <div className="flex gap-4">
                    <Button onClick={handleCapture} disabled={hasCameraPermission !== true} className="w-full">
                        <Camera className="mr-2 h-4 w-4" />
                        Capture Photo
                    </Button>
                    <Button onClick={() => setIsCameraOpen(false)} variant="outline" className="w-full">
                        Cancel
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">{t('disease_prevention.page_title')}</h1>
                <p className="text-muted-foreground">
                    {t('disease_prevention.page_subtitle')}
                </p>
            </div>

            {!results ? (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('disease_prevention.form_title')}</CardTitle>
                        <CardDescription>{t('disease_prevention.form_subtitle')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                             <label className="font-medium">{t('disease_prevention.select_disease_label')}</label>
                            <Select onValueChange={setSelectedDisease} value={selectedDisease} disabled={isLoading || !!uploadedPhoto}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('disease_prevention.select_disease_placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {commonDiseases.map(disease => (
                                        <SelectItem key={disease} value={disease}>{disease}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <hr className="flex-grow border-t" />
                            <span className="text-muted-foreground text-sm">{t('disease_prevention.or_divider')}</span>
                            <hr className="flex-grow border-t" />
                        </div>
                        
                        <div>
                          <label className="font-medium">{t('disease_prevention.upload_photo_label')}</label>
                          <div className="mt-2">
                            {uploadedPhoto ? (
                              <div className="relative w-full max-w-xs">
                                <Image src={uploadedPhoto} alt="Uploaded plant" width={200} height={150} className="rounded-md object-cover" />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-7 w-7"
                                  onClick={() => setUploadedPhoto(null)}
                                  disabled={isLoading}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className='flex gap-2'>
                                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    {t('disease_prevention.upload_photo_button')}
                                </Button>
                                 <Button type="button" variant="outline" onClick={() => setIsCameraOpen(true)} disabled={isLoading}>
                                    <Camera className="mr-2 h-4 w-4" />
                                    Take Photo
                                </Button>
                              </div>
                            )}
                            <Input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                              disabled={isLoading}
                            />
                            <p className="text-sm text-muted-foreground mt-2">{t('disease_prevention.upload_photo_description')}</p>
                          </div>
                        </div>

                        <Button onClick={handleGetDiagnosis} disabled={isLoading} className="w-full md:w-auto">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? t('disease_prevention.loading_button') : t('disease_prevention.submit_button')}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <DiagnosisResults results={results} onNewDiagnosis={handleNewDiagnosis} />
            )}
        </div>
    );
}


type DiagnosisResultsProps = {
  results: DiagnoseCropDiseaseOutput;
  onNewDiagnosis: () => void;
};

function DiagnosisResults({ results, onNewDiagnosis }: DiagnosisResultsProps) {
    const { t } = useLanguage();
    
    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    {results.isDiseaseIdentified ? (
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <ShieldAlert className="h-8 w-8 text-destructive" />
                            {results.disease}
                        </CardTitle>
                    ) : (
                        <CardTitle className="flex items-center gap-2 text-2xl">
                             <AlertCircle className="h-8 w-8 text-amber-500" />
                            {t('disease_prevention.results_not_identified_title')}
                        </CardTitle>
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">{results.description}</p>
                    
                    {results.isDiseaseIdentified && (
                        <>
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Leaf className="h-5 w-5 text-green-500"/>
                                    {t('disease_prevention.results_prevention_title')}
                                </h3>
                                <ul className="list-disc list-inside space-y-2 mt-2 pl-4 text-muted-foreground">
                                    {results.prevention.map((step, index) => (
                                        <li key={`prev-${index}`}>{step}</li>
                                    ))}
                                </ul>
                            </div>
                            
                             <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-blue-500"/>
                                    {t('disease_prevention.results_treatment_title')}
                                </h3>
                                <ul className="list-disc list-inside space-y-2 mt-2 pl-4 text-muted-foreground">
                                    {results.treatment.map((step, index) => (
                                        <li key={`treat-${index}`}>{step}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                    
                     {!results.isDiseaseIdentified && !results.treatment.length && !results.prevention.length && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{t('disease_prevention.results_no_info_title')}</AlertTitle>
                            <AlertDescription>{t('disease_prevention.results_no_info_description')}</AlertDescription>
                        </Alert>
                    )}
                    
                </CardContent>
            </Card>

            <Button onClick={onNewDiagnosis} className="w-full md:w-auto">
                {t('disease_prevention.new_diagnosis_button')}
            </Button>
        </div>
    )
}
