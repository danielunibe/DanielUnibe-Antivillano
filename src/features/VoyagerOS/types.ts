export type Notification = {
  id: number;
  title: string;
  message: string;
  time?: string;
  imageUrl?: string;
  gradient?: string;
  iconType?: string;
};

export type GroundingChunk = {
  web: {
    uri: string;
    title: string;
  };
};
