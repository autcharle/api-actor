export const API_ERROR = {
  INVALID_INPUT: "API-400",
  NOT_FOUND: "API-404",
  INTERNAL_SERVER_ERROR: "API-500",
};

export const ERROR = {
  MISSING_ACTOR_NAME: "Missing first name or last name",
  UPDATING_NOT_FOUND_ACTOR: "Actor not found to be updated",
  DELETING_NOT_FOUND_ACTOR: "Actor not found to be deleted",
  NOT_FOUND_ACTOR: "Actor not found",
  INTERNAL_SERVER_ERROR: "Internal server error",
  NOT_FOUND_FILM: "Film not found",
  MISSING_REQUIRED_FIELDS: "Missing required fields",
  DELETING_NOT_FOUND_FILM: "Film not found to be deleted",
  UPDATING_NOT_FOUND_FILM: "Film not fount to be updated",
  FIRST_NAME_PATTERN:
    "First name can only contain letters, spaces, hyphens and apostrophes",
  FIRST_NAME_LETTER_MIN: "First name must be at least 2 characters long",
  FIRST_NAME_LETTER_MAX: "First name cannot exceed 45 characters",
  FIRST_NAME_REQUIRED: "First name is required",
  LAST_NAME_PATTERN:
    "Last name can only contain letters, spaces, hyphens and apostrophes",
  LAST_NAME_LETTER_MIN: "Last name must be at least 2 characters long",
  LAST_NAME_LETTER_MAX: "Last name cannot exceed 45 characters",
  LAST_NAME_REQUIRED: "Last name is required",
  PATH_PARAM_ID_MUST_BE_NUM: "ID must be a number",
  PATH_PARAM_ID_MUST_BE_INT: "ID must be an integer",
  PATH_PARAM_ID_MUST_BE_POSITIVE: "ID must be positive",
  PATH_PARAM_ID_REQUIRED: "ID is required",
};
