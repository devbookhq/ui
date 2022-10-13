import dockerNames from 'docker-names'

export function createRandomTitle() {
  return dockerNames.getRandomName().replace('_', '-')
}
