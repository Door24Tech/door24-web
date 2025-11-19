import probe from "probe-image-size";
import type { ProbeResult } from "probe-image-size";
import {
  MentorHeaderValidationError,
  type AvatarRef,
  type MentorKey,
} from "@/lib/prototypeMentorHeader";

const REQUIRED_DIMENSION = 68;
const dimensionCache = new Map<string, { width: number; height: number }>();

const probeUrl = async (url: string): Promise<{ width: number; height: number }> => {
  if (dimensionCache.has(url)) {
    return dimensionCache.get(url)!;
  }

  try {
    const result: ProbeResult = await probe(url);
    const dimensions = { width: result.width, height: result.height };
    dimensionCache.set(url, dimensions);
    return dimensions;
  } catch (error) {
    console.error("Failed to probe avatar asset:", error);
    throw new MentorHeaderValidationError(
      `Unable to verify image dimensions for ${url}. Please ensure the asset is publicly accessible and 68x68px.`
    );
  }
};

export const validateAvatarDimensions = async (
  avatarSource: Record<MentorKey, AvatarRef>,
  existing?: Record<MentorKey, AvatarRef>
) => {
  const tasks = Object.entries(avatarSource).map(async ([mentor, value]) => {
    const typedMentor = mentor as MentorKey;

    if (existing && existing[typedMentor]?.url === value.url) {
      return;
    }

    const { width, height } = await probeUrl(value.url);

    if (width !== REQUIRED_DIMENSION || height !== REQUIRED_DIMENSION) {
      throw new MentorHeaderValidationError(
        `${mentor} avatar must be exactly ${REQUIRED_DIMENSION}x${REQUIRED_DIMENSION}px. Received ${width}x${height}px.`
      );
    }
  });

  await Promise.all(tasks);
};


