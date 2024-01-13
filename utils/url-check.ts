export const isYouTubeUrl = (input: string): string | null => {
  const youtubeRegex =
    /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

  const match = input.match(youtubeRegex);
  return match ? input : null;
};

export const parseId = (url: string) => {
  if (!url.includes('you') && url.length == 11) {
    return url;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};
