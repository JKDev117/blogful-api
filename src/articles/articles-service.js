
//making a service object first involves making an object that we'll export
const ArticlesService = {
    getAllArticles(knex){
        return knex.select('*').from('blogful_articles')
    },
    //adding articles
    insertArticle(knex, newArticle){
        return knex
            .insert(newArticle)
            .into('blogful_articles')
            //returning() allows us to specify which columns we want
            .returning('*')
            //to pull the item out of the returned array
            .then(rows => {
                return rows[0]
            })
    },
    //get a specific article
    getById(knex, id){
        return knex.from('blogful_articles').select('*').where('id', id).first()
    },
    //delete an article
    deleteArticle(knex, id){
        return knex('blogful_articles')
            .where({id})
            .delete()
    },
    //update article
    updateArticle(knex, id, newArticleFields){
        return knex('blogful_articles')
            .where({id})
            .update(newArticleFields)
    }
    


}

module.exports = ArticlesService


/* Note

//What is ArticlesService? (read pgs. 3-5, 17.14)

*/

