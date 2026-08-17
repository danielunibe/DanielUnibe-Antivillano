import React, { useEffect, useCallback } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { FolderItem } from './desktop/types';
import { DesktopItem } from './desktop/DesktopItem';
import { FolderOverlay } from './desktop/FolderOverlay';
import { QuickLookWindow } from './desktop/QuickLookWindow';
import { ContextMenu } from './desktop/ContextMenu';
import { useDesktopItems } from '../hooks/useDesktopItems';

export const DesktopIcons: React.FC = () => {
  const {
    items,
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
  } = useDesktopItems();



  const handleItemClick = useCallback((id: string) => {
    setContextMenu(null);
    setSelectedIconId(id);
  }, [setContextMenu, setSelectedIconId]);

  const handleItemDoubleClick = useCallback((id: string) => {
    setContextMenu(null);
    handleOpenTarget(id);
  }, [setContextMenu, handleOpenTarget]);

  const handleItemLongPress = useCallback(() => {
    setIsEditMode(true);
    setSelectedIconId(null);
    setContextMenu(null);
  }, [setIsEditMode, setSelectedIconId, setContextMenu]);

  const handleCloseFolder = useCallback(() => {
    setOpenFolderId(null);
  }, [setOpenFolderId]);

  const handleCloseQuickLook = useCallback(() => {
    setQuickLookId(null);
  }, [setQuickLookId]);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, [setContextMenu]);

  const handleToggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, [setIsEditMode]);

  const activeFolder = items.find(i => i.id === openFolderId) as FolderItem | undefined;
  const activeQuickLookItem = items.find(i => i.id === quickLookId);

  return (
    <LayoutGroup>
      <div 
        className="absolute inset-0 z-10 select-none overflow-hidden" 
        onClick={handleBackgroundClick}
        onContextMenu={handleBackgroundContextMenu}
      >
        {items.map(item => (
          <DesktopItem
            key={item.id}
            item={item}
            isSelected={selectedIconId === item.id}
            isEditMode={isEditMode}
            isDragging={draggingId === item.id}
            isQuickLooking={quickLookId === item.id}
            setRef={(el: HTMLDivElement | null) => {
              if (el) itemsRef.current.set(item.id, el);
              else itemsRef.current.delete(item.id);
            }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleItemClick(item.id);
            }}
            onDoubleClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleItemDoubleClick(item.id);
            }}
            onLongPress={handleItemLongPress}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onRemove={handleDeleteTarget}
            onContextMenu={(e: React.MouseEvent) => {
              handleItemContextMenu(e, item.id, item.type);
            }}
          />
        ))}
        
        <AnimatePresence>
          {openFolderId && activeFolder && (
            <FolderOverlay 
              folder={activeFolder} 
              onClose={handleCloseFolder} 
              onRemoveItem={(itemId: string) => handleRemoveFromFolder(openFolderId, itemId)}
              isEditMode={isEditMode}
            />
          )}
          {quickLookId && activeQuickLookItem && (
            <QuickLookWindow 
              item={activeQuickLookItem} 
              onClose={handleCloseQuickLook} 
            />
          )}
          {contextMenu && (
            <ContextMenu
              key="context-menu"
              x={contextMenu.x}
              y={contextMenu.y}
              targetId={contextMenu.targetId}
              targetType={contextMenu.targetType}
              onClose={handleCloseContextMenu}
              onNewFolder={handleNewFolder}
              onNewFile={handleNewFile}
              onOrganize={handleOrganize}
              onShuffleWallpaper={handleShuffleWallpaper}
              onDeleteTarget={handleDeleteTarget}
              onOpenTarget={handleOpenTarget}
              onRenameTarget={handleRenameTarget}
              onShowProperties={handleShowProperties}
              onToggleEditMode={handleToggleEditMode}
              isEditMode={isEditMode}
            />
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
};
