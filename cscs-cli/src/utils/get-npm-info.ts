import axios from 'axios';
import urlJoin from 'url-join';
import semver from 'semver';

function getNpmInfo(npmName: string, registry?: string) {
  if (!npmName) {
    return null;
  }
  const registryUrl = registry || getDefaultRegistry();
  const npmInfoUrl = urlJoin(registryUrl, npmName);
  return axios.get(npmInfoUrl).then(response => {
    if (response.status === 200) {
      return response.data;
    }
    return null;
  }).catch(err => {
    console.log('error', err.message);
    // return Promise.reject(err);
  });
}

function getDefaultRegistry() {
  // return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org';
  return 'https://registry.npmjs.org';
}

async function getNpmVersions(npmName: string, registry?: string): Promise<string[]> {
  const data = await getNpmInfo(npmName, registry);
  if (data) {
    return Object.keys(data.versions);
  } else {
    return [];
  }
}

function getSemverVersions(baseVersion: string, versions: string[]) {
  return versions
    .filter(version => semver.satisfies(version, `>${baseVersion}`))
    .sort((a, b) => semver.gt(b, a) ? 1 : -1);
}

async function getNpmSemverVersion(baseVersion: string, npmName: string, registry?: string) {
  const versions = await getNpmVersions(npmName, registry);
  const newVersions = getSemverVersions(baseVersion, versions);
  if (newVersions && newVersions.length > 0) {
    return newVersions[0];
  }
  return null;
}

async function getNpmLatestVersion(npmName: string, registry: string) {
  let versions: any = await getNpmVersions(npmName, registry);
  if (versions) {
    return versions.sort((a: string | semver.SemVer, b: string | semver.SemVer) => semver.gt(b, a))[0];
  }
  return null;
}

export {
  getNpmInfo,
  getNpmVersions,
  getNpmSemverVersion,
  getDefaultRegistry,
  getNpmLatestVersion,
};
