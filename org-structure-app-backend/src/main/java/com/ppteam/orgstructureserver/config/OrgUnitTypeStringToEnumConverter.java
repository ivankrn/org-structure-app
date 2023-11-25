package com.ppteam.orgstructureserver.config;

import com.ppteam.orgstructureserver.controller.error.WrongOrganizationalUnitTypeException;
import com.ppteam.orgstructureserver.database.model.OrganizationalUnitType;
import org.springframework.core.convert.converter.Converter;

public class OrgUnitTypeStringToEnumConverter implements Converter<String, OrganizationalUnitType> {
    @Override
    public OrganizationalUnitType convert(String source) {
        try {
            return OrganizationalUnitType.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new WrongOrganizationalUnitTypeException();
        }
    }
}

