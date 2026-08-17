import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DesktopItemObj, FolderItem, AppItem } from '../components/desktop/types';

const initialItems: DesktopItemObj[] = [
  { id: 'browser', type: 'app', label: 'Navegador OS', icon: 'Globe', x: 16, y: 16 },
  { id: '1', type: 'app', label: 'Unibelands 3', icon: 'Gamepad2', x: 16, y: 76 },
  { id: '2', type: 'app', label: 'Proyec.TDH.IA', icon: 'Cpu', x: 16, y: 136 },
  { id: '3', type: 'image', label: 'Kirby World', url: '/assets/portfolio/projects/020_daniel-unibe-kirbyword.jpg', x: 16, y: 196 },
  { 
    id: '5', 
    type: 'folder', 
    label: 'CodePen Demos', 
    x: 88, 
    y: 16,
    items: [
      { id: 'cp1', type: 'app', label: 'JoxoMod UI', icon: 'Code', x: 0, y: 0 },
      { id: 'cp2', type: 'app', label: 'RNavqyJ FX', icon: 'Code', x: 0, y: 0 },
      { id: 'cp3', type: 'app', label: 'YPqGrpZ Pro', icon: 'Code', x: 0, y: 0 },
      { id: 'cp4', type: 'app', label: 'Kwzybxo Engine', icon: 'Code', x: 0, y: 0 },
    ]
  },
  { 
    id: '6', 
    type: 'folder', 
    label: '3D Gallery', 
    x: 88, 
    y: 76,
    items: [
      { id: '3d1', type: 'app', label: 'Diorama Stage', icon: 'Boxes', x: 0, y: 0 },
      { id: '3d2', type: 'app', label: 'Mickey Piece', icon: 'Boxes', x: 0, y: 0 },
      { id: '3d3', type: 'app', label: 'Robot Render', icon: 'Boxes', x: 0, y: 0 },
      { id: '3d4', type: 'app', label: 'Luigi Boo', icon: 'Boxes', x: 0, y: 0 },
    ]
  },
  { id: '4', type: 'image', label: 'Sci-Fi Pistol', url: '/assets/portfolio/projects/024_daniel-unibe-pistola-2.jpg', x: 88, y: 136 },
  { id: '7', type: 'app', label: 'Papelera', icon: 'Trash2', x: 88, y: 196 },
];

export const useDesktopItems = () => {
  const [items, setItems] = useState<DesktopItemObj[]>(initialItems);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [quickLookId, setQuickLookId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, targetId: string | null, targetType: string | null } | null>(null);
  
  const itemsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (selectedIconId && !isEditMode && !openFolderId) {
          e.preventDefault();
          setQuickLookId(prev => prev ? null : selectedIconId);
        }
      } else if (e.code === 'Escape') {
        setQuickLookId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIconId, isEditMode, openFolderId]);

  const handleBackgroundClick = useCallback((_e: React.MouseEvent) => {
    setSelectedIconId(null);
    setContextMenu(null);
    if (openFolderId) {
      setOpenFolderId(null);
    } else if (isEditMode) {
      setIsEditMode(false);
    }
  }, [openFolderId, isEditMode]);

  const handleBackgroundContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ 
      x: e.clientX, 
      y: e.clientY, 
      targetId: null, 
      targetType: null 
    });
  }, []);

  const handleItemContextMenu = useCallback((e: React.MouseEvent, itemId: string, itemType: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIconId(itemId);
    setContextMenu({ 
      x: e.clientX, 
      y: e.clientY, 
      targetId: itemId, 
      targetType: itemType 
    });
  }, []);

  const handleNewFolder = useCallback((x: number, y: number) => {
    const id = `folder_${Date.now()}`;
    const label = `Nueva Carpeta`;
    const newItem: FolderItem = {
      id,
      type: 'folder',
      label,
      items: [],
      x: Math.max(20, x - 40),
      y: Math.max(50, y - 40)
    };
    setItems(prev => [...prev, newItem]);
    setSelectedIconId(id);
  }, []);

  const handleNewFile = useCallback((x: number, y: number) => {
    const id = `image_${Date.now()}`;
    const label = `Imagen Nueva`;
    const newItem: DesktopItemObj = {
      id,
      type: 'image',
      label,
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
      x: Math.max(20, x - 40),
      y: Math.max(50, y - 40)
    };
    setItems(prev => [...prev, newItem]);
    setSelectedIconId(id);
  }, []);

  const handleOrganize = useCallback(() => {
    setItems(prev => {
      const heightLimit = window.innerHeight - 150;
      const rowsCount = Math.max(1, Math.floor(heightLimit / 105));
      return prev.map((item, index) => {
        const col = Math.floor(index / rowsCount);
        const row = index % rowsCount;
        return {
          ...item,
          x: 25 + col * 110,
          y: 70 + row * 105
        };
      });
    });
  }, []);

  const handleShuffleWallpaper = useCallback(() => {
    window.dispatchEvent(new CustomEvent('shuffle-wallpaper'));
  }, []);

  const handleDrag = useCallback((draggedId: string, dx: number, dy: number) => {
    setDraggingId(draggedId);
    setItems(prev => {
      return prev.map(item => {
        if (item.id === draggedId) {
          const newX = Math.max(5, Math.min(window.innerWidth - 90, item.x + dx));
          const newY = Math.max(5, Math.min(window.innerHeight - 140, item.y + dy));
          return { ...item, x: newX, y: newY };
        }
        return item;
      });
    });
  }, []);

  const handleGroupItems = useCallback((draggedId: string, targetId: string) => {
    setItems(prev => {
      const dragged = prev.find(i => i.id === draggedId);
      const target = prev.find(i => i.id === targetId);
      
      if (!dragged || !target || dragged.type === 'folder' || (dragged.type === 'folder' && target.type === 'folder')) return prev;
      
      const newArray = prev.filter(i => i.id !== draggedId && i.id !== targetId);
      
      if (target.type === 'app') {
        const newFolder: FolderItem = {
          id: `folder_${Date.now()}`,
          type: 'folder',
          label: 'Carpeta',
          items: [target, dragged as AppItem],
          x: target.x, 
          y: target.y
        };
        return [...newArray, newFolder];
      } else if (target.type === 'folder') {
        const newFolder: FolderItem = {
          ...target,
          items: [...target.items, dragged as AppItem]
        };
        return [...newArray, newFolder];
      }
      return prev;
    });
  }, []);

  const handleDragEnd = useCallback((draggedId: string) => {
    setDraggingId(null);
    const draggedEl = itemsRef.current.get(draggedId);
    if (!draggedEl) return;
    
    let droppedOnId: string | null = null;
    
    const draggedRect = draggedEl.getBoundingClientRect();
    const centerX = draggedRect.left + draggedRect.width / 2;
    const centerY = draggedRect.top + draggedRect.height / 2;
    
    itemsRef.current.forEach((el, id) => {
      if (id !== draggedId && !droppedOnId) {
        const rect = el.getBoundingClientRect();
        if (
          centerX >= rect.left && centerX <= rect.right &&
          centerY >= rect.top && centerY <= rect.bottom
        ) {
          droppedOnId = id;
        }
      }
    });

    if (droppedOnId) {
      handleGroupItems(draggedId, droppedOnId);
    }
  }, [handleGroupItems]);

  const handleRemoveFromFolder = useCallback((folderId: string, itemId: string) => {
    setItems(prev => {
      const folder = prev.find(i => i.id === folderId);
      if (!folder || folder.type !== 'folder') return prev;
      
      const newItems = folder.items.filter(i => i.id !== itemId);
      if (newItems.length === 0) {
        setOpenFolderId(null);
        return prev.filter(i => i.id !== folderId);
      }
      
      return prev.map(item => {
        if (item.id === folderId) {
          return { ...item, items: newItems };
        }
        return item;
      });
    });
  }, []);

  const handleDeleteTarget = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setSelectedIconId(prev => prev === id ? null : prev);
  }, []);

  const handleOpenTarget = useCallback((id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      if (item.type === 'image') {
        setQuickLookId(id);
      } else if (item.type === 'folder') {
        setOpenFolderId(id);
      } else {
        const event = new CustomEvent('system-notification', {
          detail: {
            title: `Ejecutando ${item.label}`,
            message: `El programa ${item.label} se ha lanzado con éxito en VoyagerOS.`
          }
        });
        window.dispatchEvent(event);
      }
      return prev;
    });
  }, []);

  const handleRenameTarget = useCallback((id: string) => {
    setItems(prev => {
      const current = prev.find(i => i.id === id);
      if (!current) return prev;
      const newName = window.prompt("Cambiar nombre del elemento:", current.label);
      if (newName && newName.trim()) {
        return prev.map(item => item.id === id ? { ...item, label: newName.trim() } : item);
      }
      return prev;
    });
  }, []);

  const handleShowProperties = useCallback((id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item) {
        const desc = `Tipo: ${item.type === 'app' ? 'Aplicación' : item.type === 'folder' ? 'Carpeta' : 'Imagen'} | Posición: (${Math.round(item.x)}, ${Math.round(item.y)}) | VoyagerOS v12`;
        const event = new CustomEvent('system-notification', {
          detail: {
            title: `Propiedades: ${item.label}`,
            message: desc
          }
        });
        window.dispatchEvent(event);
      }
      return prev;
    });
  }, []);

  return {
    items,
    setItems,
    selectedIconId,
    setSelectedIconId,
    draggingId,
    isEditMode,
    setIsEditMode,
    openFolderId,
    setOpenFolderId,
    quickLookId,
    setQuickLookId,
    contextMenu,
    setContextMenu,
    itemsRef,
    handleBackgroundClick,
    handleBackgroundContextMenu,
    handleItemContextMenu,
    handleNewFolder,
    handleNewFile,
    handleOrganize,
    handleShuffleWallpaper,
    handleDrag,
    handleDragEnd,
    handleRemoveFromFolder,
    handleDeleteTarget,
    handleOpenTarget,
    handleRenameTarget,
    handleShowProperties,
  };
};
