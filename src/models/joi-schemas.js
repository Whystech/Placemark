import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({
  firstName: Joi.string().example("Homer").required(),
  lastName: Joi.string().example("Simpson").required(),
}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

export const PoiSpec = Joi.object()
  .keys({
    name: Joi.string().required().example("Central Park"),
    description: Joi.string().allow("").optional().example("Very large park in New York, it is a representative part of the city, visited by many."),
    /// Limit min/max for the latitude/longitude
    latitude: Joi.number().min(-90).max(90).required().example(40.785091),
    summary: Joi.string().max(255).allow("").required().example("Large public park in New York."),
    longitude: Joi.number().min(-180).max(180).required().example(-73.968285),
    category: Joi.string().valid(
    "Restaurant",
    "Cafe",
    "Bar",
    "Restaurant",
    "Park",
    "Museum",
    "Hotel",
    "Shop",
    "Theatre",
    "Landmark",
    "Educational",
    "Company",
    "Farm",
    "Road",
    "Garden",
    "Bridge",
    "Hike",
    "Shopping Centre",
    "Airport",
    "Bus",
    "Train",
    "Bank",
    "Police",
    "Pharmacy",
    "Hospital",
    "Clinic",
    "Other"
  )
  .required()
  .example("Park"),
    userid: IdSpec,
  })
  .label("Poi");

export const PoiSpecPlus = PoiSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PoiPlus");

export const PoiArraySpec = Joi.array().items(PoiSpecPlus).label("PoiArray");

export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
  })
  .label("JwtAuth");
