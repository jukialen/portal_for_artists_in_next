'use client';

import { FilesUploadType } from 'types/global.types';

const MAX_PHOTO_SIZE = 6291456;
export const filesProfileTypes = '.jpg, .jpeg, .png, .webp, .avif';
export const filesTypes = '.apng, .mp4, .webm';
const ACCEPTED_IMAGE_TYPES = filesProfileTypes.split(', ').map((n) => 'image/' + n.replace('.', ''));
const ACCEPTED_ANIM_VIDEOS_TYPES = filesTypes
  .split(', ')
  .map((a) => `${a.includes('apng') ? 'image/' : 'video/'}` + a.replace('.', ''));
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

export const validatePhoto = async (
  filesUploadTranslated: FilesUploadType,
  file: File,
  profile: boolean = true,
): Promise<string | null> => {
  !file && filesUploadTranslated.validateRequired;

  profile && file.size > MAX_PHOTO_SIZE && filesUploadTranslated.fileTooLarge;

  if (!profile) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type) && !ACCEPTED_ANIM_VIDEOS_TYPES.includes(file.type)) {
      return filesUploadTranslated.unsupportedFileType;
    }
  } else if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return filesUploadTranslated.unsupportedFileType;
  }
  return null;
};
