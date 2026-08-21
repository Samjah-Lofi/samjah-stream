export type Channel = {
    id: number;
    slug: string;
    title: string;
    description: string;
    longDescription: string;
    image: string;
    streamUrl: string;
    duration: string;
    tracks: number;
    featured: boolean;
    perfectFor: string[];
    tags: string[];
  };