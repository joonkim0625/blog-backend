module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define(
    "post",
    {
      userId: {
        // UUID
        type: Sequelize.UUID,
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      boardType: {
        type: Sequelize.STRING,
      },

      body: {
        type: Sequelize.TEXT,
      },
    },
    {
      tableName: "posts",
      classMethods: {
        addTSVector: function (db) {
          return db.sequelize
            .query("ALTER TABLE posts ADD COLUMN title_body_tsvector tsvector")
            .then(function () {
              return db.sequelize.query(
                "UPDATE posts SET title_body_tsvector=setweight(to_tsvector('english', title), 'A') || setweight(to_tsvector('english', body), 'B')"
              );
            })
            .then(function () {
              return db.sequelize.query(
                "CREATE INDEX IF NOT EXISTS title_body_search_idx ON posts USING gin(title_body_tsvector)"
              );
            })
            .then(function () {
              return db.sequelize.query(
                "CREATE OR REPLACE FUNCTION posts_trigger() RETURNS trigger AS $$ begin new.title_body_tsvector := setweight(to_tsvector('english', new.title), 'A') || setweight(to_tsvector('english', new.body), 'B'); return new; end $$ LANGUAGE plpgsql"
              );
            })
            .then(function () {
              return db.sequelize.query(
                "CREATE TRIGGER posts_update BEFORE INSERT OR UPDATE ON posts FOR EACH ROW EXECUTE PROCEDURE posts_trigger()"
              );
            })
            .catch(function (err) {
              console.info(err);
            });
        },
      },
      hooks: {
        afterSync: function (Post) {
          return Post.classMethods.addTSVector(Post);
        },
      },
    }
  );

  Post.searchText = function (db, tsquery) {
    var query =
      tsquery.indexOf(" ") == -1
        ? "to_tsquery('english','" + tsquery + "')"
        : "plainto_tsquery('english','" + tsquery + "')";
    return db.sequelize.query(
      "SELECT id, title, ts_rank_cd(title_body_tsvector," +
        query +
        ",1) AS rank, ts_headline('english', title || ' ' || body," +
        query +
        ", 'MaxWords=100') AS headline FROM posts WHERE title_body_tsvector @@ " +
        query +
        " ORDER BY rank DESC, id DESC",
      { model: db.post }
    );
  };

  return Post;
};
