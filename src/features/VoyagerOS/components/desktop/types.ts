export type AppItem = {
  id: string;
  type: 'app';
  label: string;
  icon: string;
  x: number;
  y: number;
};

export type FolderItem = {
  id: string;
  type: 'folder';
  label: string;
  items: AppItem[];
  x: number;
  y: number;
};

export type ImageItem = {
  id: string;
  type: 'image';
  label: string;
  url: string;
  x: number;
  y: number;
};

export type DesktopItemObj = AppItem | FolderItem | ImageItem;
