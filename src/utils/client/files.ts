'use client';

import { FilesUploadType, Plan } from 'types/global.types';

export const MAX_PHOTO_SIZE = 6291456;
export const filesProfileTypes = '.jpg, .jpeg, .png, .webp, .avif';
export const filesTypes = '.apng, .mp4, .webm';
export const ACCEPTED_IMAGE_TYPES = filesProfileTypes.split(', ').map((n) => 'image/' + n.replace('.', ''));
export const ACCEPTED_ANIM_VIDEOS_TYPES = filesTypes
  .split(', ')
  .map((a) => `${a.includes('apng') ? 'image/' : 'video/'}` + a.replace('.', ''));
export const isFileAccessApiSupported =
  typeof window !== 'undefined' && typeof window.showOpenFilePicker === 'function';

const checkPLanForFileSize = (plan: Plan, fileSize: number, fileType: 'PHOTO' | 'VIDEO') => {
  switch (plan) {
    case 'FREE':
      if ((fileSize > 1048576 && fileType === 'PHOTO') || (fileSize > 15728640 && fileType === 'VIDEO')) {
        return 'too big file';
      }
      return null;
    case 'PREMIUM':
      if ((fileSize > 3145728 && fileType === 'PHOTO') || (fileSize > 52428800 && fileType === 'VIDEO')) {
        return 'too big file';
      }
      return null;
    case 'GOLD':
      if ((fileSize > 5242880 && fileType === 'PHOTO') || (fileSize > 209715200 && fileType === 'VIDEO')) {
        return 'too big file';
      }
      return null;
  }
};

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

export const validateFile = async (
  filesUploadTranslated: FilesUploadType,
  file: File,
  plan: Plan,
  profile: boolean = true,
) => {
  !file && filesUploadTranslated.validateRequired;
  let error: string | null = null;

  switch (profile) {
    case true:
      error = !ACCEPTED_IMAGE_TYPES.includes(file.type) ? filesUploadTranslated.unsupportedFileType : null;

      error = file.size > MAX_PHOTO_SIZE ? filesUploadTranslated.fileTooLarge : null;
      break;
    case false:
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type) && !ACCEPTED_ANIM_VIDEOS_TYPES.includes(file.type)) {
        const fileType = ACCEPTED_IMAGE_TYPES.includes(file.type) ? 'PHOTO' : 'VIDEO';

        error = checkPLanForFileSize(plan, file.size, fileType);
        error = filesUploadTranslated.unsupportedFileType;
      }

      return error;
  }
};
