import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _Actor from  "./Actor.js";

export default function initModels(sequelize) {
  const Actor = _Actor.init(sequelize, DataTypes);


  return {
    Actor,
  };
}
