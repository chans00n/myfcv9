'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoModal } from '@/components/ui/video-modal';

export default function VideoTestPage() {
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  const [isVimeoModalOpen, setIsVimeoModalOpen] = useState(false);
  const [isSelfHostedModalOpen, setIsSelfHostedModalOpen] = useState(false);

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Video Modal Test</h1>
        <p className="text-muted-foreground">
          This page demonstrates the video modal functionality with different video sources.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>YouTube Video</CardTitle>
            <CardDescription>
              Embed a YouTube video in the modal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setIsYoutubeModalOpen(true)}
              className="w-full"
            >
              Open YouTube Video
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vimeo Video</CardTitle>
            <CardDescription>
              Embed a Vimeo video in the modal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setIsVimeoModalOpen(true)}
              className="w-full"
            >
              Open Vimeo Video
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Self-Hosted Video</CardTitle>
            <CardDescription>
              Play a self-hosted video with custom controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setIsSelfHostedModalOpen(true)}
              className="w-full"
            >
              Open Self-Hosted Video
            </Button>
          </CardContent>
        </Card>
      </div>

      <VideoModal 
        isOpen={isYoutubeModalOpen}
        onClose={() => setIsYoutubeModalOpen(false)}
        title="YouTube Video Example"
        videoSource={{
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }}
      />

      <VideoModal 
        isOpen={isVimeoModalOpen}
        onClose={() => setIsVimeoModalOpen(false)}
        title="Vimeo Video Example"
        videoSource={{
          type: 'vimeo',
          url: 'https://vimeo.com/148751763'
        }}
      />

      <VideoModal 
        isOpen={isSelfHostedModalOpen}
        onClose={() => setIsSelfHostedModalOpen(false)}
        title="Self-Hosted Video Example"
        videoSource={{
          type: 'self-hosted',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        }}
      />
    </div>
  );
} 