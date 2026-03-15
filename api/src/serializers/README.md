# Serializers

Serializers control API response shape. Use them to decide what leaves the server and how associations are exposed.

## Responsibilities

- Expose only the fields needed by the client
- Keep controller responses consistent
- Separate response formatting from models and services

## Structure

- Group serializers by resource under `api/src/serializers/{resource}/`
- Export resource serializers through the resource folder index when the folder has multiple serializers
- Use distinct serializers for list and detail responses when they expose different fields

## Guidelines

- Name output types to match the response shape, such as `UserAsIndex` and `UserAsShow`
- Validate association assumptions before serializing nested data
- Keep serializers declarative and focused on transformation, not authorization or persistence
