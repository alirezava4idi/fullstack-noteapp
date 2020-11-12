const knex = require('../knexfile')
const KNEX = require('knex')
const conn = KNEX(knex.development)
module.exports = {
    users: {
        create: function(user){
            return conn('user').insert(user)
        },
        login: function(email){
            return conn('user').where('email', email).first()
        },
        addSession: function(token){
            return conn('sessions').insert(token)
        },
        getSession: function(token){
            return conn('sessions').where('session', token).first()
        },
        deleteSession: function(user_id){
            return conn('sessions').where('user_id', user_id).del()
        }
    },
    notes:{
        getAll: function(user_id){
            return conn("note")
                .where("user_id", user_id)
                .select("id", "content", "updated_at");
        },
        create: function(note){
            return conn("note").insert(note)
        },
        getOne: function(note_id){
            return conn("note")
                    .where("id", note_id)
                    .select("id", "content", "updated_at")
                    .first();
        },
        updateOne: function(note){
            return conn("note").where("id", note.id).update(note)
        },
        deleteOne: function(note_id){
            return conn("note").where("id", note_id).del()
        }
    }
}
