// @ts-nocheck
import sql from './client'

export interface QueryResult<T = Record<string, unknown>> {
  data: T | null
  error: { message: string; code: string } | null
}

export async function selectOne<T = Record<string, unknown>>(
  table: string,
  conditions: Record<string, unknown>,
  select: string = '*'
): Promise<QueryResult<T>> {
  try {
    const keys = Object.keys(conditions)
    const values = Object.values(conditions)

    if (keys.length === 0) {
      return { data: null, error: { message: 'No conditions provided', code: 'NO_CONDITIONS' } }
    }

    const whereClause = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ')
    const result = await sql.unsafe(
      `SELECT ${select} FROM ${table} WHERE ${whereClause} LIMIT 1`,
      values
    )

    if (result.length === 0) {
      return { data: null, error: { message: 'Not found', code: 'NOT_FOUND' } }
    }

    return { data: result[0] as T, error: null }
  } catch (err) {
    return {
      data: null,
      error: {
        message: err instanceof Error ? err.message : 'Unknown error',
        code: 'QUERY_ERROR'
      }
    }
  }
}

export async function selectMany<T = Record<string, unknown>>(
  table: string,
  conditions: Record<string, unknown>,
  select: string = '*',
  orderBy?: string,
  limit?: number
): Promise<{ data: T[] | null; error: { message: string; code: string } | null }> {
  try {
    const keys = Object.keys(conditions)
    const values = Object.values(conditions)

    let query = `SELECT ${select} FROM ${table}`

    if (keys.length > 0) {
      const whereClause = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ')
      query += ` WHERE ${whereClause}`
    }

    if (orderBy) {
      query += ` ORDER BY ${orderBy}`
    }

    if (limit) {
      query += ` LIMIT ${limit}`
    }

    const result = await sql.unsafe(query, values)

    return { data: result as T[], error: null }
  } catch (err) {
    return {
      data: null,
      error: {
        message: err instanceof Error ? err.message : 'Unknown error',
        code: 'QUERY_ERROR'
      }
    }
  }
}

export async function insert<T = Record<string, unknown>>(
  table: string,
  data: Record<string, unknown>,
  returning: string = '*'
): Promise<{ data: T | null; error: { message: string; code: string } | null }> {
  try {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')

    const result = await sql.unsafe(
      `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING ${returning}`,
      values
    )

    return { data: result[0] as T, error: null }
  } catch (err) {
    return {
      data: null,
      error: {
        message: err instanceof Error ? err.message : 'Unknown error',
        code: 'INSERT_ERROR'
      }
    }
  }
}

export async function update<T = Record<string, unknown>>(
  table: string,
  data: Record<string, unknown>,
  conditions: Record<string, unknown>,
  returning: string = '*'
): Promise<{ data: T | null; error: { message: string; code: string } | null }> {
  try {
    const setKeys = Object.keys(data)
    const setValues = Object.values(data)
    const condKeys = Object.keys(conditions)
    const condValues = Object.values(conditions)

    const setClause = setKeys.map((key, i) => `${key} = $${i + 1}`).join(', ')
    const whereClause = condKeys.map((key, i) => `${key} = $${i + setKeys.length + 1}`).join(' AND ')

    const result = await sql.unsafe(
      `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING ${returning}`,
      [...setValues, ...condValues]
    )

    return { data: result[0] as T | null, error: null }
  } catch (err) {
    return {
      data: null,
      error: {
        message: err instanceof Error ? err.message : 'Unknown error',
        code: 'UPDATE_ERROR'
      }
    }
  }
}

export async function remove(
  table: string,
  conditions: Record<string, unknown>
): Promise<{ error: { message: string; code: string } | null }> {
  try {
    const keys = Object.keys(conditions)
    const values = Object.values(conditions)

    if (keys.length === 0) {
      return { error: { message: 'No conditions provided', code: 'NO_CONDITIONS' } }
    }

    const whereClause = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ')

    await sql.unsafe(
      `DELETE FROM ${table} WHERE ${whereClause}`,
      values
    )

    return { error: null }
  } catch (err) {
    return {
      error: {
        message: err instanceof Error ? err.message : 'Unknown error',
        code: 'DELETE_ERROR'
      }
    }
  }
}
