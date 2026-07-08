'use client';

import { FilesUploadType } from 'types/global.types';
import { filesProfileTypes, filesTypes } from 'utils/common/files';

export const isFileAccessApiSupported =
  typeof window !== 'undefined' && typeof window.showOpenFilePicker === 'function';

export const handleFileSelection = async (
  filesUploadTranslated: FilesUploadType,
  profile: boolean = true,
): Promise<File | null | string> => {
  try {
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'Images',
          accept: {
            'image/*': !profile ? filesProfileTypes.split(', ').concat('.apng') : filesProfileTypes.split(', '),
          },
        },
        ...(!profile
          ? [
              {
                description: 'Videos',
                accept: {
                  'video/*': filesTypes.split(', ').filter((r) => r !== '.apng'),
                },
              },
            ]
          : []),
      ],
      multiple: false,
    });
    return (await handle.getFile()) as File | null;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return filesUploadTranslated.fileSelectionCancelled;
    } else {
      console.error('Błąd podczas otwierania showOpenFilePicker:', err);
      return filesUploadTranslated.errorOpeningFilePicker;
    }
  }
};
