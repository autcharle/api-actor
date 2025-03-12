import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _Actor from  "./Actor.js";
import _Film from  "./Film.js";

export default function initModels(sequelize) {
  const Actor = _Actor.init(sequelize, DataTypes);
  const Film = _Film.init(sequelize, DataTypes);

  Film.belongsTo(Language, { as: "language", foreignKey: "languageId"});
  Language.hasMany(Film, { as: "films", foreignKey: "languageId"});
  Film.belongsTo(Language, { as: "originalLanguage", foreignKey: "originalLanguageId"});
  Language.hasMany(Film, { as: "originalLanguageFilms", foreignKey: "originalLanguageId"});

  return {
    Actor,
    Film,
  };
}
