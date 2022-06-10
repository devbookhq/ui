import { api } from '@devbookhq/sdk'

const createEnv = api.path('/envs/{codeSnippetID}').method('post').create({ api_key: true })
const deleteEnv = api.path('/envs/{codeSnippetID}').method('delete').create({ api_key: true })
const updateEnv = api.path('/envs/{codeSnippetID}').method('patch').create({ api_key: true })

export {
  createEnv,
  deleteEnv,
  updateEnv,
}
