import axios from 'axios';

const endpoints = [
  {
    url: 'https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/',
    headers: {
      'X-RapidAPI-Key': '54113d86fbmshd2d33092866458bp119333jsnb6d93500de3d',
      'X-RapidAPI-Host': 'youtube-mp3-downloader2.p.rapidapi.com',
    },
    params: {
      url: 'https://www.youtube.com/watch?v=hN5MBlGv2Ac',
    },
  },
  {
    url: 'https://youtube-mp36.p.rapidapi.com/dl',
    params: {id: 'UxxajLWwzqY'},
    headers: {
      'X-RapidAPI-Key': '54113d86fbmshd2d33092866458bp119333jsnb6d93500de3d',
      'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
    },
  },
];

console.log('length', endpoints.length);

const downloadMusicFromEndpoint = async endpoint => {
  try {
    const response = await axios.get(endpoint.url, {
      params: endpoint.params,
      headers: endpoint.headers,
    });
    return response;
  } catch (error) {
    console.error(`Error downloading music: ${error.message}`);
    return null;
  }
};

export const downloadMusicRecursive = async currentEndpointIndex => {
  if (currentEndpointIndex >= endpoints.length) {
    console.log('All attempts failed. Unable to download music.');
    throw new Error('All attempts failed. Unable to download music.');
  }

  const musicData = await downloadMusicFromEndpoint(
    endpoints[currentEndpointIndex],
  );
  if (musicData) {
    console.log('Music downloaded successfully.');
    return musicData;
  } else {
    // Retry with the next endpoint
    downloadMusicRecursive(currentEndpointIndex + 1);
  }
};
