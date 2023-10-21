import { v4 as uuid } from 'uuid';

export default class {
    id = undefined;
    organizationID = undefined;
    name = undefined;
    points = undefined;
    description = undefined;
    type = undefined;
    reason = undefined;
    pixCode = undefined;
    isActive = undefined;
    createdAt = undefined;
    updatedAt = undefined;

    constructor(organizationID, name, points, description, type, reason, pixCode) {
        const now = new Date();

        this.id = uuid();
        this.organizationID = organizationID;
        this.name = name;
        this.points = points;
        this.description = description;
        this.type = type;
        this.reason = reason;
        this.pixCode = pixCode;
        this.isActive = false;
        this.createdAt = now;
        this.updatedAt = now;
    }

    static enrich(
        id,
        organizationID,
        name,
        points,
        description,
        type,
        reason,
        pixCode,
        isActive,
        createdAt,
        updatedAt
    ) {
        const event = Object.create(this.prototype);
        event.id = id;
        event.organizationID = organizationID;
        event.name = name;
        event.points = points;
        event.description = description;
        event.type = type;
        event.reason = reason;
        event.pixCode = pixCode;
        event.isActive = isActive;
        event.createdAt = createdAt;
        event.updatedAt = updatedAt;
        return event;
    }
}
