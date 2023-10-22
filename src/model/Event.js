import { v4 as uuid } from 'uuid';

const TYPES = {
    AUXILIO_VOLUNTARIO: 'Auxílio voluntário',
    AUXILIO_FINANCEIRO: 'Auxílio financeiro'
};

const REASONS = {
    REFLORESTAMENTO: 'Reflorestamento',
    DESASTRES_NATURAIS: 'Desastres naturais',
    SERVIÇOS_SOCIAIS: 'Serviços sociais',
    COLETA_DE_LIXO: 'Coleta de lixo',
    SAUDE_DA_COMUNIDADE: 'Saúde da comunidade',
    CAUSA_ANIMAL: 'Causa animal'
};

const REASON_POINTS = {
    REFLORESTAMENTO: 10.4,
    DESASTRES_NATURAIS: 9.4,
    SERVIÇOS_SOCIAIS: 9.6,
    COLETA_DE_LIXO: 9.1,
    SAUDE_DA_COMUNIDADE: 12.8,
    CAUSA_ANIMAL: 13.4
};

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

    static getTypes() {
        return TYPES;
    }

    static getReasons() {
        return REASONS;
    }

    constructor(organizationID, name, description, type, reason, pixCode) {
        const now = new Date();

        this.id = uuid();
        this.organizationID = organizationID;
        this.name = name;
        this.points = REASON_POINTS[type] || 10;
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
