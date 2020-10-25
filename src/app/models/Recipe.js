/* eslint-disable */
const db = require('../../config/db')
const {
  date
} = require('../../lib/utils')

module.exports = {
  all() {
    return db.query(`SELECT recipes.*, chefs.name AS chefs_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`)
  },
  create(data) {
    const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `

    const values = [
      data.chef,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso
    ]

    return db.query(query, values)
  },
  find(id) {
    return db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1`, [id])
  },
  findTotalRecipes(id) {
    return db.query(`SELECT recipes.*, count(recipes) AS total_recipes
      FROM recipes
      LEFT JOIN recipes ON (recipes.recipe_id = recipes.id)
      WHERE recipes.id = $1
      GROUP BY recipes.id`, [id])
  },
  update(data) {
    const query = `
        UPDATE recipes SET
            chef_id=($1),
            title=($2),
            ingredients=($3),
            preparation=($4),
            information=($5)
        WHERE id = $6
        `

    const values = [
      data.chef,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.id
    ]

    return db.query(query, values)
  },
  chefsSelectOptions() {
    return db.query(`SELECT name,  id FROM chefs`)
  },
  files(id) {
    return db.query(`
    SELECT recipe_files.*,
    files.name AS name, files.path AS path, files.id AS file_id
    FROM recipe_files
    LEFT JOIN files ON (recipe_files.file_id = files.id)
    WHERE recipe_files.recipe_id = $1`, [id])
  },
  findRecipes(id) {
    return db.query(`
            SELECT recipes.*, chefs.name AS chefs_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1`, [id])
  },

  findByRecipes(params) {
    let { search, limit, offset } = params;
    let query = '',
        filterQuery = '',
        totalQuery = `(
            SELECT count(*) FROM recipes
        ) AS total`,
        orderBy = 'ORDER BY recipes.created_at DESC';

    if (search) {
        filterQuery = `
        WHERE recipes.title ILIKE '%${search}%'
        `;

        totalQuery = `(
            SELECT count(*) FROM recipes
            ${filterQuery}
        ) AS total`;

        orderBy = 'ORDER BY recipes.updated_at DESC'
    }

    query = `
    SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    ${filterQuery}
    ${orderBy}
    LIMIT $1 OFFSET $2
    `;

    return db.query(query, [limit, offset]);
},
  delete(id) {
    return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
  }
}