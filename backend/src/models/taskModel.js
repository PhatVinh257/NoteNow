import db from "../config/db.js";

export const findAllTask = async (
  search = "",
  pageSize = 5,
  offset = 0,
  filter = "all",
  startDate = null
) => {

  const conditions = []
  const params = []

  // SEARCH
  if (search) {
    params.push(`%${search}%`)
    conditions.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`)
  }

  // FILTER STATUS
  if (filter === "completed") {
    conditions.push(`is_completed = true`)
  } else if (filter === "pending") {
    conditions.push(`is_completed = false`)
  }

  // FILTER DATE
  if (startDate) {
    params.push(startDate)
    conditions.push(`created_at >= $${params.length}`)
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : ""

  // DATA QUERY
  const dataQuery = `
    SELECT * FROM tasks
    ${whereClause}
    ORDER BY id ASC
    LIMIT $${params.length + 1}
    OFFSET $${params.length + 2}
  `

  // COUNT QUERY (reuse conditions + params)
  const countQuery = `
    SELECT 
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE is_completed = false) AS pending,
      COUNT(*) FILTER (WHERE is_completed = true) AS completed
    FROM tasks
    ${whereClause}
  `

  const [dataRes, countRes] = await Promise.all([
    db.query(dataQuery, [...params, pageSize, offset]),
    db.query(countQuery, params)
  ])

  return {
    tasks: dataRes.rows,
    total: parseInt(countRes.rows[0].total),
    stats: countRes.rows[0]
  }
}

export const createNewTask = async (title) => {
 const result = await db.query("INSERT INTO tasks(title) VALUES ($1) RETURNING *", [title])
 return result.rows
}
export const updateATask = async (title,description,is_completed,id) => { 
 const result = await db.query("UPDATE tasks SET title = COALESCE($1,title), description = COALESCE($2,description), is_completed = COALESCE($3,is_completed),completed_at = CASE WHEN $3 = true THEN CURRENT_TIMESTAMP ELSE completed_at END, updated_at = CURRENT_TIMESTAMP WHERE id=$4 RETURNING *",[title,description,is_completed,id])
 return result.rows[0]
}
export const deleteATask = async (id) => { 
 const result = await db.query("DELETE FROM tasks WHERE id =$1 RETURNING *", [id])
 return result.rows[0]
}