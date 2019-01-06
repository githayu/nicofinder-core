import { has, omit } from 'lodash-es'
import { parse, stringify } from 'qs'

interface Options {
  search?: {
    offset: number
    limit: number
  }
  params?: {
    query: string
    page?: number
    filters?: any[]
  }
}

function createSearchParams(opts: Options, shouldStringify: true): string
function createSearchParams(opts: Options, shouldStringify: false): {}

function createSearchParams(opts: Options = {}, shouldStringify = false) {
  const { search: searchProps, params: requestParams } = opts

  const currentQuery = parse(location.search, {
    ignoreQueryPrefix: true,
  })

  const page =
    searchProps === undefined
      ? 1
      : Math.floor(searchProps.offset / searchProps.limit) + 1
  const queryParams = searchProps === undefined ? currentQuery : searchProps
  const currentParams = {
    query: queryParams.query,
    method: queryParams.method,
    service: queryParams.service,
    sort: queryParams.sort,
    order: queryParams.order,
    targets: queryParams.targets,
    filters: queryParams.filters,
    ...(page > 1 ? { page } : {}),
  }

  const reqPage = has(requestParams, 'page') ? requestParams.page : 1

  const newParams = {
    ...currentParams,
    ...omit(requestParams, ['page']),
    ...(reqPage > 1 ? { page: reqPage } : {}),
  }

  return shouldStringify ? stringify(newParams) : newParams
}

export default createSearchParams
