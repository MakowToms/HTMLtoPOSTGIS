package com.tm.parcelsupply.Mapper;

import com.tm.parcelsupply.Dto.ParcelDto;
import com.tm.parcelsupply.Model.ParcelEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ParcelMapper {

    ParcelMapper INSTANCE = Mappers.getMapper(ParcelMapper.class);

    ParcelDto mapEntity(ParcelEntity example);
}
