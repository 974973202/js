import axios from 'axios';

function getNpmInfo(projectId: string) {
  // const registry = 'https://registry.npmjs.org/';
  // const url = urlJoin(registry, npmName);
  const url = `http://gitlab1.chinacscs.com/api/v4/projects/${projectId}/repository/tags`;
  return axios.get(url).then(response => {
    try {
      return response.data;
    } catch (err) {
      return Promise.reject(err);
    }
  });
}

export function getTagsAllList(projectId: string) {
  return getNpmInfo(projectId).then(data => {
    return data?.map((item: { name: any; }) => item.name)
  });
}
